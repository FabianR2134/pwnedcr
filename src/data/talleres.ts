export interface Taller {
  titulo: string;
  instructores: string[];
  descripcion: string;
  fecha: string;
  costo: 'gratis' | string;
  badge?: string;
  registroUrl?: string;
  detalles?: {
    titulo: string;
    items: string[];
  }[];
  requisitos: string[];
}

export const talleres: Taller[] = [
  {
    titulo: "Windows Local Privilege Escalation",
    instructores: ["Gerardo Mejia — CRTO, CRTP, PNPT, eCCPT"],
    descripcion: "Taller 100% práctico para identificar, explotar y mitigar vulnerabilidades de escalada de privilegios locales en Windows. Ideal para quienes preparan eCCPT / OSCP / PNPT y equipos Blue/Red.",
    fecha: "Miércoles 15 y Jueves 16 de Octubre · 6:30–9:30 pm · Zoom",
    costo: "$45 USD",
    badge: "Pre-conference · Online",
    registroUrl: "https://www.tickettailor.com/events/pwnedcr/1902906",
    detalles: [
      {
        titulo: "Laboratorios (hands-on)",
        items: [
          "AlwaysInstallElevated",
          "Answer files (Unattend files)",
          "Logon Autostart Execution (Registry Run Keys)",
          "Logon Autostart Execution (Startup Folder)",
          "Leaked Credentials (GitHub, Hardcoded, PowerShell History)",
          "SeBackupPrivilege / SeImpersonatePrivilege",
          "Stored Credentials (Runas)",
          "UAC Bypass",
          "Unquoted Service Path",
          "Weak Service Binary / Service / Registry Permissions",
        ],
      },
      {
        titulo: "Lo que te llevás",
        items: [
          "VM de Windows Server vulnerable (OVA)",
          "Repositorio con scripts, notas y recetas LPE",
          "Certificado de participación",
          "Grabación disponible post-taller",
        ],
      },
    ],
    requisitos: [
      "Laptop 8GB RAM (recomendado 16 GB), SSD, 60–80 GB libres",
      "VirtualBox instalado",
    ],
  },
  {
    titulo: "How to find vulnerabilities from the genesis: secure code review from a hacker perspective",
    instructores: ["Sebastian Oros Padilla"],
    descripcion: "De código espagueti a secure clean code. Cómo adoptar la mentalidad de atacante para revisar código de forma crítica e identificar las vulnerabilidades del OWASP Top 10 antes de que salgan a producción.",
    fecha: "Sábado 18 de Octubre · 10:00 am",
    costo: "gratis",
    detalles: [
      {
        titulo: "Lo que aprenderás",
        items: [
          "Mentalidad de atacante para revisión de código",
          "Patrones que llevan a vulnerabilidades OWASP Top 10 (SQLi, XSS, BAC, etc.)",
          "Principios de codificación segura: validación, encoding, manejo de errores",
          "Cómo mejorar el impacto de tus code reviews y pentests",
        ],
      },
    ],
    requisitos: ["Traer laptop"],
  },
  {
    titulo: "Comprometiendo redes internas: técnicas reales contra Active Directory desde Linux",
    instructores: ["Rodrigo Alvarado"],
    descripcion: "Bootcamp práctico de Internal Network Penetration Testing: Kerberoasting, relay de NTLM, abuso de ADCS (ESC1, ESC6, ESC8), PetitPotam, BloodHound y movimiento lateral en entornos AD reales.",
    fecha: "Sábado 18 de Octubre · 11:00 am",
    costo: "gratis",
    detalles: [
      {
        titulo: "Temas cubiertos",
        items: [
          "Reconocimiento: SMB, LLMNR/NBT-NS, DHCP, DNS, LDAP",
          "Enumeración con CrackMapExec y BloodHound",
          "Kerberoasting, AS-REP Roasting, abuso de DACL",
          "Ataques ADCS: ESC1, ESC6, ESC8",
          "Coerción de autenticación: PetitPotam, PrinterBug",
          "Relaciones de confianza entre dominios",
        ],
      },
    ],
    requisitos: [
      "Traer laptop",
      "Máquina virtual con Kali Linux (8GB RAM mínimo)",
    ],
  },
  {
    titulo: "El Upe Inalámbrico — RFID Hacking con Arduino",
    instructores: ["Ana Gutiérrez", "Stephanie Villalta Segura"],
    descripcion: "Exploración de vulnerabilidades en tarjetas RFID y su clonación con Arduino RC522. Teoría de radiofrecuencia, demos con Flipper Zero y construcción de un dispositivo clonador funcional que te llevás a casa.",
    fecha: "Sábado 18 de Octubre · 2:00 pm",
    costo: "$65 USD (materiales incluidos)",
    registroUrl: "https://buytickets.at/pwnedcr/1850967",
    detalles: [
      {
        titulo: "Puntos clave",
        items: [
          "Fundamentos de RFID y arquitectura de seguridad",
          "Demos prácticas con Flipper y clonadores comerciales",
          "Montaje y programación de lector-clonador Arduino RC522",
          "Troubleshooting y pruebas del prototipo",
        ],
      },
      {
        titulo: "Materiales incluidos",
        items: ["Kit started de Arduino + materiales para comunicación RFID"],
      },
    ],
    requisitos: [
      "Traer laptop",
      "Tener instalado Arduino IDE",
      "Instalar biblioteca MFRC522 by GithubCommunity (desde Library Manager)",
    ],
  },
  {
    titulo: "Introducción a los Capture the Flag con Hack The Box",
    instructores: ["HackHers"],
    descripcion: "Introducción al mundo CTF: conceptos fundamentales, categorías (steganography, crypto, web, pwn, forensics), beneficios y ejercicios guiados en Hack The Box para que puedas participar en tu primera competencia.",
    fecha: "Sábado 18 de Octubre · 4:00 pm",
    costo: "gratis",
    requisitos: [
      "Traer laptop",
      "Máquina virtual con Kali Linux",
      "Cuenta gratuita en Hack The Box",
    ],
  },
  {
    titulo: "Exploración RF: Introducción al sniffing con ESP32",
    instructores: ["Jaime Mora Meléndez"],
    descripcion: "Construí tu propio dispositivo ESP32 para detectar redes WiFi y triangular su ubicación. Teoría de radiofrecuencia, programación de hardware y una dinámica de triangulación al final del taller.",
    fecha: "Domingo 19 de Octubre · 9:00 am",
    costo: "$40 USD (hardware incluido)",
    registroUrl: "https://buytickets.at/pwnedcr/1850989",
    detalles: [
      {
        titulo: "Hardware incluido",
        items: ["ESP32, Breadboard, Módulo GPS, Módulo de pantalla y más"],
      },
    ],
    requisitos: [
      "Laptop (Windows o Linux)",
      "Arduino IDE con boards: ESP8266, TinyGPSPlus, Time (Michael Margolis), Adafruit SSD 1306",
      "Anaconda instalado (o cuenta de Google Colab)",
    ],
  },
  {
    titulo: "OWASP API Pentest",
    instructores: ["Omar Gudiño"],
    descripcion: "Taller intensivo para identificar, explotar y mitigar las vulnerabilidades del OWASP API Security Top 10 en APIs RESTful modernas, con ejercicios prácticos y escenarios reales.",
    fecha: "Domingo 19 de Octubre · 12:00 pm",
    costo: "gratis",
    requisitos: [
      "Laptop con al menos 8GB de RAM",
      "Postman, Firefox, Docker instalados",
      "VAmPI instalado y corriendo",
    ],
  },
  {
    titulo: "Qué es Core DMP en Windows y cómo se usa para extraer claves",
    instructores: ["Eduardo Vindas"],
    descripcion: "Qué es LSASS, de dónde vienen las claves que extrae Mimikatz, y qué son los archivos .DMP. Perspectiva forense y de desarrollo (a nivel de drivers y aplicaciones) para entender estos conceptos fundamentales.",
    fecha: "Domingo 19 de Octubre · 2:00 pm",
    costo: "gratis",
    requisitos: [
      "Traer laptop",
      "Windows instalado (en laptop o VM)",
      "Herramientas de desarrollo Windows instaladas",
      "Máquina virtual con Kali Linux",
    ],
  },
];
