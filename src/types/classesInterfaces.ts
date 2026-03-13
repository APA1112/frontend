export interface Service {
  antennaIp: string;
  antennaMac: string;
  apName: string;
  signalStrength: string;
  type: string;
  installAddress: string;
  status: string;
}

export interface Client {
  fullName: string;
  dni: string;
  phone: string;
  address: string;
  createdAt: string; // Symfony suele enviarlo en formato ISO 8601
  services: Service[]
}