export interface Sponsor {
  nombre: string;
  url: string;
  logo: string;
  alt: string;
}

export interface SponsorTier {
  tier: 'Diamond' | 'Gold' | 'Silver' | 'Bronce';
  sponsors: Sponsor[];
}

export const sponsorTiers: SponsorTier[] = [
  {
    tier: 'Diamond',
    sponsors: [
      {
        nombre: 'Akamai',
        url: 'https://www.akamai.com/',
        logo: 'https://pwnedcr.com/wp-content/uploads/2025/08/akamai-logo-rgb.svg',
        alt: 'Akamai',
      },
      {
        nombre: 'GBM',
        url: 'https://www.gbm.net/',
        logo: 'https://dc11506.org/wp-content/uploads/2025/08/Logo-azul-GBM-2023.png',
        alt: 'GBM',
      },
      {
        nombre: 'Equifax',
        url: 'https://www.equifax.com/',
        logo: 'https://dc11506.org/wp-content/uploads/2025/08/Equifax_red_rgb_HR.png',
        alt: 'Equifax',
      },
    ],
  },
  {
    tier: 'Gold',
    sponsors: [
      {
        nombre: 'Sophos',
        url: 'https://www.sophos.com',
        logo: 'https://dc11506.org/wp-content/uploads/2025/08/sophos-logo-tagline-white.png',
        alt: 'Sophos',
      },
    ],
  },
  {
    tier: 'Silver',
    sponsors: [
      {
        nombre: 'Hack The Box',
        url: 'https://www.hackthebox.com/',
        logo: 'https://pwnedcr.com/wp-content/uploads/2025/08/HTB-White-Silver.png',
        alt: 'Hack The Box',
      },
      {
        nombre: 'CompTIA',
        url: 'https://www.comptia.org/',
        logo: 'https://pwnedcr.com/wp-content/uploads/2025/08/comptia-logo-large_png.png',
        alt: 'CompTIA',
      },
      {
        nombre: 'PwnedLabs',
        url: 'https://pwnedlabs.io/',
        logo: 'https://pwnedcr.com/wp-content/uploads/2025/09/5ff2c40e-1468-45c2-85bb-61c2a9e8e68c.jpg',
        alt: 'PwnedLabs',
      },
      {
        nombre: 'FSecurity',
        url: 'https://fsecuritysolutions.com/',
        logo: 'https://pwnedcr.com/wp-content/uploads/2025/08/fsecurity.png',
        alt: 'FSecurity',
      },
      {
        nombre: 'Hawks',
        url: 'https://hawksec-academy.com/',
        logo: 'https://pwnedcr.com/wp-content/uploads/2025/09/HAWKS.svg',
        alt: 'Hawks',
      },
      {
        nombre: 'Spartan Cybersec',
        url: 'https://www.spartan-cybersec.com/',
        logo: 'https://pwnedcr.com/wp-content/uploads/2025/09/Logo_Horizontal_Positivo.png',
        alt: 'Spartan Cybersec',
      },
    ],
  },
  {
    tier: 'Bronce',
    sponsors: [
      {
        nombre: 'Ulatina',
        url: 'https://www.ulatina.ac.cr/',
        logo: 'https://pwnedcr.com/wp-content/uploads/2025/09/01-Ulatina-Corto-gris.png',
        alt: 'Ulatina',
      },
      {
        nombre: 'TrueSec',
        url: 'https://true-sec.com/',
        logo: 'https://pwnedcr.com/wp-content/uploads/2025/09/trusec.png',
        alt: 'TrueSec',
      },
      {
        nombre: 'CyberSector',
        url: 'https://cybersector.io/',
        logo: 'https://pwnedcr.com/wp-content/uploads/2025/09/sector.png',
        alt: 'CyberSector',
      },
    ],
  },
];
