#include "DHT.h"
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <BH1750.h>
#include <Wire.h>

// DHT
#define DHTPIN 4
#define DHTTYPE DHT11

// GPIO
#define LEDPIN 5
#define FANPIN 16
#define AIR_CONDITIONERPIN 17

// WiFi Config
const char* WIFI_SSID = "iPhone";
const char* WIFI_PASS = "88888888";

// MQTT Config
const char* MQTT_SERVER = "172.20.10.7";
const int MQTT_PORT = 1883;
const char* username = "user1";
const char* password = "123";
const int qos = 1;

const String topicLed = "esp32/led";
const String topicFan = "esp32/fan";
const String topicAirConditioner = "esp32/air_conditioner";
const String topicInitDevice = "initDevice";
const String topicSetupDevice = "setupDevice";

// MQTT client
WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);

// Sensors
DHT dht(DHTPIN, DHTTYPE);
BH1750 lightMeter;

void mqttCallback(char* topic, byte* payload, unsigned int length) {
  String topicStr = String(topic);
  String message;

  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  JsonDocument dataReceive;
  deserializeJson(dataReceive, message);

  if (topicStr != topicInitDevice) {
    String status = dataReceive["status"];

    if (topicStr == topicLed) {
      digitalWrite(LEDPIN, status == "off" ? LOW : HIGH);
    } else if (topicStr == topicFan) {
      digitalWrite(FANPIN, status == "off" ? LOW : HIGH);
    } else if (topicStr == topicAirConditioner) {
      digitalWrite(AIR_CONDITIONERPIN, status == "off" ? LOW : HIGH);
    }

    String requestId = dataReceive["requestId"];
    if (requestId != NULL) {
      JsonDocument response;
      response["id"] = requestId;

      size_t len = measureJson(response) + 1;
      char output[len];
      serializeJson(response, output, len);

      mqttClient.publish("control-device", output);
    }

  } else if (topicStr == topicInitDevice) {
    digitalWrite(LEDPIN, dataReceive["led"] == "off" ? LOW : HIGH);
    digitalWrite(FANPIN, dataReceive["fan"] == "off" ? LOW : HIGH);
    digitalWrite(AIR_CONDITIONERPIN, dataReceive["air_conditioner"] == "off" ? LOW : HIGH);
  }
}

void setup() {
  Serial.begin(9600);

  // WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Lỗi kết nối wifi");
  }

  Serial.print("\n WiFi Connected. IP: ");
  Serial.println(WiFi.localIP());

  // MQTT
  mqttClient.setServer(MQTT_SERVER, MQTT_PORT);
  mqttClient.setCallback(mqttCallback);
  mqttClient.setKeepAlive(60);
  mqttClient.setSocketTimeout(30);

  String clientId = "ESP32Client";

  while (!mqttClient.connected()) {
    Serial.print("Kết nối MQTT...");
    if (mqttClient.connect(clientId.c_str(), username, password)) {
      Serial.println("Thành công!");

      mqttClient.subscribe(topicLed.c_str(), qos);
      mqttClient.subscribe(topicFan.c_str(), qos);
      mqttClient.subscribe(topicAirConditioner.c_str(), qos);
      mqttClient.subscribe(topicInitDevice.c_str(), qos);

    } else {
      Serial.print("Thất bại, lỗi: ");
      Serial.println(mqttClient.state());
      delay(2000);
    }
  }

  // DHT + GPIO
  dht.begin();
  pinMode(LEDPIN, OUTPUT);
  pinMode(FANPIN, OUTPUT);
  pinMode(AIR_CONDITIONERPIN, OUTPUT);

  mqttClient.publish(topicSetupDevice.c_str(), NULL);

  // BH1750
  Wire.begin(21, 22);
  lightMeter.begin();
}

void loop() {
  delay(2000);

  // WiFi reconnect
  if (WiFi.status() != WL_CONNECTED) {
    WiFi.disconnect();
    WiFi.begin(WIFI_SSID, WIFI_PASS);

    unsigned long startAttemptTime = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < 5000) {
      delay(500);
      Serial.print(".");
    }
  }

  // MQTT reconnect
  if (!mqttClient.connected()) {
    mqttClient.setServer(MQTT_SERVER, MQTT_PORT);
    mqttClient.setCallback(mqttCallback);
    mqttClient.setKeepAlive(60);
    mqttClient.setSocketTimeout(30);

    String clientId = "ESP32Client";
    while (!mqttClient.connected()) {
      Serial.print("Kết nối MQTT...");
      if (mqttClient.connect(clientId.c_str(), username, password)) {
        Serial.println("Thành công!");

        mqttClient.subscribe(topicLed.c_str(), qos);
        mqttClient.subscribe(topicFan.c_str(), qos);
        mqttClient.subscribe(topicAirConditioner.c_str(), qos);
        mqttClient.subscribe(topicInitDevice.c_str(), qos);

        mqttClient.publish(topicSetupDevice.c_str(), NULL);

      } else {
        Serial.print("Thất bại, lỗi: ");
        Serial.println(mqttClient.state());
        delay(2000);
      }
    }
  }

  // Read sensor
  JsonDocument data;

  float h = dht.readHumidity();
  float t = dht.readTemperature();
  float lux = lightMeter.readLightLevel();
  int rain = random(0, 1000);
  int windSpeed = random(0, 1000);
  int pressure = random(0, 1000);

  data["humidity"] = h;
  data["temperature"] = t;
  data["brightness"] = lux;
  data["rain"] = rain;
  data["windSpeed"] = windSpeed;
  data["pressure"] = pressure;

  size_t len = measureJson(data) + 1;
  char output[len];
  serializeJson(data, output, len);

  if (mqttClient.connected()) {
    Serial.println(output);
    mqttClient.publish("topic/sendData", output);
  }

  mqttClient.loop();
}
