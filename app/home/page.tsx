import Image from 'next/image'

const HOME_BACKGROUND_SRC = "/images/FOND D'ECRAN - Classique 4- We Are Link.png"

export default function HomePage() {
  return (
    <div className="relative h-[calc(100dvh-4rem)] w-full" aria-hidden>
      <Image
        src={HOME_BACKGROUND_SRC}
        alt=""
        fill
        className="object-cover object-center"
        priority
        sizes="100vw"
      />
    </div>
  )
}
