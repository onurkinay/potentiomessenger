void setup() {
  Serial.begin(9600); 

}

void loop() {
  // put your main code here, to run repeatedly:
  Serial.println( analogRead(0) );
  delay(1000); 
}
