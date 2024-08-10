#include "DHT.h"

//Temperature Sensor: 3.3 Volt
#define DHTPIN 7
#define DHPTYPE DHT11
DHT dht(DHTPIN, DHPTYPE);

//Water Sensor: 3.3 Volt
#define POWER_PIN 2
#define WATER_LEVEL_PIN A1
#define WATER_THRESHHOLD 5

//UV Sensor: 5 Volt
#define UV_INTENSITY_PIN A0

//Soil Moisture Sensor: 5 Volt
//Value decreases with greater moisture
#define SOIL_PIN A2
#define AIR_VALUE 685
#define WATER_VALUE 274

//Water Pump: 3 Volt
#define PUMP_PIN 3

void setup() {
  Serial.begin(115200);
  while (!Serial) {}

  //Water Sensor
  pinMode(POWER_PIN, OUTPUT);
  digitalWrite(POWER_PIN, LOW);

  //Temperature Sensor
  dht.begin();

  //UV Sensor
  pinMode(UV_INTENSITY_PIN, INPUT);

  //Soil Sensor
  pinMode(SOIL_PIN, INPUT);

  //Water Pump
  pinMode(PUMP_PIN, OUTPUT);
  digitalWrite(PUMP_PIN, HIGH);
}

String readMessageFromRaspberryPi() {
  if (Serial.available() > 0) {
    return Serial.readStringUntil('\n');
  }
  return "";
}

int readSoilMoisture() {
  int soilMoisture = averageAnalogRead(SOIL_PIN);
  int soilMoisturePercent = constrain(map(soilMoisture, AIR_VALUE, WATER_VALUE, 0, 100), 0, 100);
  return soilMoisturePercent;
}

//15 ml / second
void waterPump(int ml){
  unsigned int milliseconds = (unsigned int)ml/15*1000;
  digitalWrite(PUMP_PIN, LOW);
  delay(milliseconds);
  digitalWrite(PUMP_PIN, HIGH);
}

int readWaterLevel() {
  digitalWrite(POWER_PIN, HIGH);                   // turn the sensor ON
  delay(100);                                      // wait 100 milliseconds
  int value = averageAnalogRead(WATER_LEVEL_PIN);  // read the analog value from sensor
  digitalWrite(POWER_PIN, LOW);                    // turn the sensor OFF
  if (value > WATER_THRESHHOLD) {
    return 1;
  }
  return 0;
}

//Returns temperature in Celsius
int readTemperature() {
  return dht.readTemperature();
}

float readUVIntensity() {
  int uvLevel = averageAnalogRead(UV_INTENSITY_PIN);

  float outputVoltage = 5.0 * uvLevel / 1024;
  float uvIntensity = mapfloat(outputVoltage, 0.99, 2.9, 0.0, 15.0);
  return uvIntensity;
}

//Takes an average of readings on a given pin
//Returns the average
int averageAnalogRead(int pinToRead) {
  byte numberOfReadings = 8;
  unsigned int runningValue = 0;

  for (int x = 0; x < numberOfReadings; x++)
    runningValue += analogRead(pinToRead);
  runningValue /= numberOfReadings;

  return (runningValue);
}

//The Arduino Map function but for floats
//From: http://forum.arduino.cc/index.php?topic=3922.0
float mapfloat(float x, float in_min, float in_max, float out_min, float out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

int counter = 0;

void loop() {

  if (counter > 10){
    int waterLevel = readWaterLevel();
    float temperature = readTemperature();
    float uvIntensity = readUVIntensity();
    int soil = readSoilMoisture();

    Serial.print(waterLevel);
    Serial.print(" ");
    Serial.print(temperature);
    Serial.print(" ");
    Serial.print(uvIntensity);
    Serial.print(" ");
    Serial.println(soil);

    counter = 0;
  }
  else{
    counter += 1;
    String message = readMessageFromRaspberryPi();
    if (message.length() > 0){
      int ml = message.toInt();
      waterPump(ml);
    }
  }

  delay(1000);
}