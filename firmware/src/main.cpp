#include <Arduino.h>
#include <WiFiManager.h>
#include <Ticker.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <movingAvg.h>
#include <ArduinoJson.h>
#include <FS.h>
#include <SPIFFS.h>
#include <globalMacros.h>


//define your default values here, if there are different values in config.json, they are overwritten.
char id_estufa[6] = "0";
char server_ip[16]  = "000.000.000.000";
char server_port[6] = "00000";

WiFiManager wm;
WiFiManagerParameter custom_id_estufa;
WiFiManagerParameter custom_server_ip;
WiFiManagerParameter custom_server_port;
uint8_t lastWLStatus = WiFi.status();
bool shouldSaveConfig = false;

Ticker ticker;

OneWire oneWire(TEMP_SENSOR);
DallasTemperature sensors(&oneWire);

movingAvg avgpH(1000);
movingAvg avgEC(1000);

// func
void setupWifiManager();
void setupPins();
void doWiFiManager();
void doCheckWiFiStatus();
float readpH();
float readEC();
float readTemp();
void saveParamsCallback();
void toggleLed();
void setupSpiffs();
void castSensorDataToJSON();


void setup() {
  Serial.begin(115200);
  Serial.println("Starting");
  setupPins();
  setupSpiffs();
  setupWifiManager();
}

void loop() {
  doWiFiManager();
  doCheckWiFiStatus();
  //Serial.println(readpH());
  //Serial.println(readTemp());
}

void setupWifiManager () {
  WiFi.mode(WIFI_STA);
  ticker.attach_ms(600, toggleLed);
  //wm.setDebugOutput(false);

  new (&custom_id_estufa) WiFiManagerParameter ("id_estufa", "ID Estufa", id_estufa, 6);
  new (&custom_server_ip) WiFiManagerParameter ("server_ip", "Server IP", server_ip, 16);
  new (&custom_server_port) WiFiManagerParameter ("server_port", "Server Port", server_port, 6);
  wm.addParameter(&custom_id_estufa);
  wm.addParameter(&custom_server_ip);
  wm.addParameter(&custom_server_port);
  
  wm.setConfigPortalBlocking(false);
  wm.setSaveParamsCallback(saveParamsCallback);
  if(wm.autoConnect("HidroNutridor")) {
    Serial.println("Connected.");
    ticker.detach();
    digitalWrite(FEEDBACK_LED, HIGH);
  }
  else {
    Serial.println("Configportal running.");
  }
}

void setupPins() {
  // btn to reset wifi setting
  pinMode(TRIGGER_PIN, INPUT_PULLUP);

  // feedback led for wifi status
  pinMode(FEEDBACK_LED, OUTPUT);
  digitalWrite(FEEDBACK_LED, LOW);

  // relays
  pinMode(PUMP, OUTPUT);
  pinMode(NUTRIENTS, OUTPUT);
  pinMode(PH_DOWN, OUTPUT);
  pinMode(PH_UP, OUTPUT);
  digitalWrite(PUMP, HIGH);
  digitalWrite(NUTRIENTS, HIGH);
  digitalWrite(PH_DOWN, HIGH);
  digitalWrite(PH_UP, HIGH);

  // temp sensor
  sensors.begin();

  // moving average for analog sensors
  avgpH.begin();
  avgEC.begin();
}

void doWiFiManager(){
  wm.process();

  if(digitalRead(TRIGGER_PIN) == LOW) {
    Serial.println("Button pressed, reseting settings...");
    wm.resetSettings();
    ESP.restart();
  }
}

void doCheckWiFiStatus() {
  // if changed status
  if (lastWLStatus != WiFi.status()) {
    if (WiFi.status() == WL_CONNECTED) {
        ticker.detach();
        digitalWrite(FEEDBACK_LED, HIGH);
    }
    else {
      ticker.attach_ms(600, toggleLed);
    }

    lastWLStatus = WiFi.status();
  }
}

float readpH() {
  int movAvg = avgpH.reading(analogRead(PH_SENSOR)); 
  return (-0.00333333334 * movAvg + 17.5);
}

float readTemp() {
  sensors.requestTemperatures();
  return (sensors.getTempCByIndex(0));
}

float readEC() {
  int movAvg = avgEC.reading(analogRead(EC_SENSOR));
  float voltage = movAvg * VREF / ADC_RESOLUTION;
  float compensationCoefficient = 1.0 + 0.02*(readTemp() - 25.0);
  float compensationVoltage = voltage/compensationCoefficient;
  float ecValue = (133.42*compensationVoltage*compensationVoltage*compensationVoltage - 255.86*compensationVoltage*compensationVoltage + 857.39*compensationVoltage); //convert voltage value to ec value
  //float tdsValue = ecValue * 0.5;
  
  return ecValue;
}

void saveParamsCallback() {
  Serial.println("Get Params");

  shouldSaveConfig = true;

  //read updated parameters
  strcpy(id_estufa, custom_id_estufa.getValue());
  strcpy(server_ip, custom_server_ip.getValue());
  strcpy(server_port, custom_server_port.getValue());

  //save the custom parameters to FS
  if (shouldSaveConfig) {
    Serial.println("saving config");
    StaticJsonDocument<256> doc;
    doc["id_estufa"] = id_estufa;
    doc["server_ip"] = server_ip;
    doc["server_port"] = server_port;
    
    File configFile = SPIFFS.open(CONFIG_FILE, "w");
    if (!configFile) {
      Serial.println("failed to open config file for writing");
    }

    serializeJson(doc, Serial);
    Serial.println();
    serializeJson(doc, configFile);
    configFile.close();
    //end save
    shouldSaveConfig = false;
  }
}

void toggleLed() {
  digitalWrite(FEEDBACK_LED, !digitalRead(FEEDBACK_LED));
}

void setupSpiffs() {
  //clean FS, for testing
  // SPIFFS.format();

  //read configuration from FS json
  Serial.println("mounting FS...");

  if (SPIFFS.begin()) {
    Serial.println("mounted file system");
    if (SPIFFS.exists(CONFIG_FILE)) {
      //file exists, reading and loading
      Serial.println("reading config file");
      File configFile = SPIFFS.open(CONFIG_FILE, "r");
      if (configFile) {
        Serial.println("opened config file");
        size_t size = configFile.size();
        // Allocate a buffer to store contents of the file.
        char buf[size];

        configFile.readBytes(buf, size);
        
        StaticJsonDocument<256> doc;
        DeserializationError error = deserializeJson(doc, buf);

        // Test if parsing succeeds.
        if (error) {
          Serial.print(F("deserializeJson() failed: "));
          Serial.println(error.f_str());
          return;
        }
         
        serializeJson(doc, Serial);
        Serial.println();
        strcpy(id_estufa, doc["id_estufa"]);
        strcpy(server_ip, doc["server_ip"]);
        strcpy(server_port, doc["server_port"]);

      }
    }
  } else {
    Serial.println("failed to mount FS");
  }
  //end read
}

void castSensorDataToJSON() {
    StaticJsonDocument<256> doc;
    doc["id_estufa"] = id_estufa;
    doc["ph"] = readpH();
    doc["ec"] = readEC();
    doc["temp"] = readTemp();
}
