export const no = {
  connected: "Tilkoblet • Live",
  myIpIs: "Min IP-adresse er:",
  ipv4Label: "IPv4:",
  ipv6Label: "IPv6:",
  copy: "Kopier",
  copied: "Kopiert!",
  loading: "Laster inn...",
  error: "Feil",
  notDetected: "Ikke oppdaget",
  locationWarning: "⚠️ Slå på enhetens plassering og klikk Oppdater for nøyaktige detaljer.",
  refresh: "⟳ Oppdater",
  locationHeader: "PLASSERING",
  country: "Land",
  city: "By",
  region: "Region",
  postal: "Postnummer",
  timezone: "Tidssone",
  deviceHeader: "ENHET & NETTLESER",
  browser: "Nettleser",
  version: "Versjon",
  os: "OS",
  device: "Enhet",
  approxLocation: "📍 Omtrentlig plassering",
  faqHeading: "Ofte stilte spørsmål",
  articles: {
    "what-is-my-ip": {
      title: "Forstå din IP-adresse og nettverkstilstedeværelse",
      intro: "Hver enhet som er koblet til internett krever en unike identifikator kjent som en IP-adresse.",
      faqs: [
        { question: "Hva er IP-adressen min?", answer: "IP-adressen din er en unik streng med tall tildelt av din internettleverandør." },
        { question: "Hvorfor trenger nettsteder IP-en min?", answer: "Nettsteder trenger IP-adressen din for å sende data og nettsider tilbake til enheten din." },
        { question: "Er IP-adressen min offentlig?", answer: "Ja, IP-adressen som vises her er din offentlige IP-adresse." }
      ]
    },
    "what-is-my-ip-address": {
      title: "Omfattende IP-adresseanalyse",
      intro: "Få detaljert innsikt i både dine IPv4- og IPv6-adresser.",
      faqs: [
        { question: "Hva er forskjellen på IPv4 og IPv6?", answer: "IPv4 bruker 32-biters adresser, mens IPv6 bruker 128-biters adresser." },
        { question: "Kan IP-en min endre seg?", answer: "Ja, de fleste private internettforbindelser bruker dynamiske IP-er." },
        { question: "Hvordan skjuler jeg IP-adressen min?", answer: "Du kan skjule din offentlige IP-adresse ved å bruke et virtuelt privat nettverk (VPN)." }
      ]
    },
    "what-is-my-public-ip": {
      title: "Din offentlige internett-gateway og sikkerhet",
      intro: "Din offentlige IP representerer din gateway til det globale nettet.",
      faqs: [
        { question: "Hva er en offentlig IP?", answer: "En offentlig IP er hovedadressen som er tildelt ruteren din av din ISP." },
        { question: "Samsvarer min lokale IP med min offentlige IP?", answer: "Nei, lokale IP-er brukes inne i ditt private hjemmenettverk." },
        { question: "Er det trygt å dele min offentlige IP?", answer: "Selv om tilfeldig deling ikke umiddelbart kompromitterer sikkerheten, kan ondsinnede aktører bruke den." }
      ]
    },
    "what-is-my-ip-location": {
      title: "Geografisk sporing og IP-kartlegging",
      intro: "Oppdag den omtrentlige geografiske plasseringen knyttet til rutingknutepunktene dine.",
      faqs: [
        { question: "Hvor nøyaktig er IP-plassering?", answer: "IP-geolokalisering kan typisk fastslå land, region og by nøyaktig." },
        { question: "Hvorfor viser IP-plasseringen min en annen by?", answer: "ISP-er ruter ofte internett-trafikk gjennom sentrale regionale knutepunkter." },
        { question: "Hvordan kan jeg få min nøyaktige plassering?", answer: "Gi nettleseren tillatelse til å få tilgang til enhetens GPS-posisjon." }
      ]
    },
    "what-is-my-ip-address-location": {
      title: "Detaljert IP-adresseplassering og enhetsdiagnostikk",
      intro: "Kombiner nettverkets IP-identifikasjon med dype enhetsspesifikasjoner.",
      faqs: [
        { question: "Hvilken nettleser- og OS-informasjon deles?", answer: "Nettsteder kan oppdage operativsystemet og nettleseren din via User-Agent." },
        { question: "Sporer dette verktøyet historikken min?", answer: "Nei, alle oppslag skjer på klientsiden uten å lagre personlige logger." },
        { question: "Hvordan oppdaterer jeg lokasjonsdataene mine?", answer: "Klikk på Oppdater-knappen for å hente live nettverksparametere på nytt." }
      ]
    }
  }
};