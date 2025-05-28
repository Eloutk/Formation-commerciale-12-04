import Image from 'next/image';
import Link from 'next/link';

export default function DemandesPotentiels() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Demandes de potentiels</h1>
        <div className="flex justify-center">
          <Image
            src="/images/Demandespotentiels.png"
            alt="Tableau Demandes de potentiels"
            width={1200}
            height={1700}
            className="rounded-lg border shadow-sm w-full h-auto max-w-4xl"
            priority
          />
        </div>
        <div className="mt-6 text-center">
          <a
            href="https://link599528.monday.com/boards/1396284164"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
          >
            Accéder aux demandes de potentiels
          </a>
        </div>
      </div>
    </div>
  );
} 