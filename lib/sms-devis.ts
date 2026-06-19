/**
 * Devis SMS / RCS — types, calculs et sérialisation (alignés sur Vente2Calculator).
 */

export type SmsDevisType = 'sms' | 'rcs'

export type SmsDevisOptions = {
  ciblage: boolean
  baseClients: boolean
  richSms: boolean
  agent: boolean
  creaByLink: boolean
  tarifIntermarche: boolean
  duplicateCampaign: boolean
}

export type SmsDevisSendWave = {
  id: string
  date: string
  volume: string
}

export type SmsDevisContent = {
  smsType: SmsDevisType
  smsVolume: string
  smsOptions: SmsDevisOptions
  campaignMonths: string
  creaByLinkCount: string
  smsPdfComment: string
  smsRcsSendWaves: SmsDevisSendWave[]
  smsPdfImage: string | null
  unitPrice: number
  totalPrice: number
}

export type SmsDevisRecord = {
  id: string
  user_id: string
  name: string
  sms_type: SmsDevisType
  total_amount: number
  content: SmsDevisContent
  created_at: string
  updated_at: string
}

const BASE_CLIENTS_UNIT_PRICE = 0.08
const CIBLAGE_UNIT_PRICE = 0.03

function parseCampaignMonths(s: string): number {
  const parsed = parseInt(s, 10)
  return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed
}

function parseCreaByLinkCount(s: string): number {
  const parsed = parseInt(s, 10)
  return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed
}

function smsBasePU(totalUnits: number): number {
  if (totalUnits <= 0) return 0
  if (totalUnits <= 10_000) return 0.1764
  if (totalUnits <= 25_000) return 0.1666
  if (totalUnits <= 50_000) return 0.1568
  if (totalUnits <= 100_000) return 0.147
  if (totalUnits <= 500_000) return 0.131
  return 0.131
}

function rcsBasePU(volumePerCampaign: number): number {
  if (volumePerCampaign <= 0) return 0
  if (volumePerCampaign < 10_000) return -1
  if (volumePerCampaign <= 50_000) return 0.19
  return 0.15
}

export type SmsDevisPricing = {
  volumeNumber: number
  unitPrice: number
  totalPrice: number
  eligible: boolean
}

/** Recalcule PU et total HT à partir du contenu sauvegardé. */
export function computeSmsDevisPricing(content: Pick<
  SmsDevisContent,
  'smsType' | 'smsVolume' | 'smsOptions' | 'campaignMonths' | 'creaByLinkCount'
>): SmsDevisPricing {
  const volumeNumber = Math.max(0, Math.floor(Number(content.smsVolume) || 0))
  const campaignMonths = parseCampaignMonths(content.campaignMonths)
  const creaByLinkCount = parseCreaByLinkCount(content.creaByLinkCount)
  const { smsType, smsOptions } = content

  const totalUnits =
    volumeNumber > 0
      ? volumeNumber * (smsOptions.duplicateCampaign ? campaignMonths : 1)
      : 0

  if (smsType === 'sms') {
    let unitPrice = 0
    if (volumeNumber > 0) {
      if (smsOptions.baseClients) {
        unitPrice = BASE_CLIENTS_UNIT_PRICE
      } else if (smsOptions.tarifIntermarche) {
        unitPrice = 0.13
      } else {
        let opt = 0
        if (smsOptions.ciblage) opt += CIBLAGE_UNIT_PRICE
        if (smsOptions.richSms) opt += 0.021
        unitPrice = smsBasePU(totalUnits) + opt
      }
    }

    let totalPrice = 0
    if (volumeNumber > 0 && unitPrice > 0) {
      const setupFee = 190
      const variablePerCampaign = unitPrice * volumeNumber
      totalPrice =
        !smsOptions.duplicateCampaign || campaignMonths <= 1
          ? setupFee + variablePerCampaign
          : setupFee + variablePerCampaign * campaignMonths
    }

    return {
      volumeNumber,
      unitPrice,
      totalPrice,
      eligible: volumeNumber > 0 && unitPrice > 0 && totalPrice > 0,
    }
  }

  const base = rcsBasePU(volumeNumber)
  let unitPrice = 0
  if (volumeNumber > 0 && volumeNumber >= 10_000) {
    if (smsOptions.baseClients) {
      unitPrice = BASE_CLIENTS_UNIT_PRICE
    } else if (base >= 0) {
      unitPrice = base + (smsOptions.ciblage ? CIBLAGE_UNIT_PRICE : 0)
    }
  }

  let optionFee = 0
  if (smsOptions.agent) optionFee += 550
  if (smsOptions.creaByLink) optionFee += 100 * creaByLinkCount

  let totalPrice = 0
  if (volumeNumber > 0 && unitPrice > 0) {
    const setupFee = 250
    const variablePerCampaign = unitPrice * volumeNumber + optionFee
    totalPrice =
      !smsOptions.duplicateCampaign || campaignMonths <= 1
        ? setupFee + variablePerCampaign
        : setupFee + variablePerCampaign * campaignMonths
  }

  return {
    volumeNumber,
    unitPrice,
    totalPrice,
    eligible: volumeNumber >= 10_000 && unitPrice > 0 && totalPrice > 0,
  }
}

export function buildSmsDevisContent(input: {
  smsType: SmsDevisType
  smsVolume: string
  smsOptions: SmsDevisOptions
  campaignMonths: string
  creaByLinkCount: string
  smsPdfComment: string
  smsRcsSendWaves: SmsDevisSendWave[]
  smsPdfImage: string | null
  unitPrice: number
  totalPrice: number
}): SmsDevisContent {
  return {
    smsType: input.smsType,
    smsVolume: input.smsVolume,
    smsOptions: { ...input.smsOptions },
    campaignMonths: input.campaignMonths,
    creaByLinkCount: input.creaByLinkCount,
    smsPdfComment: input.smsPdfComment,
    smsRcsSendWaves: input.smsRcsSendWaves.map((w) => ({ ...w })),
    smsPdfImage: input.smsPdfImage,
    unitPrice: input.unitPrice,
    totalPrice: input.totalPrice,
  }
}

export function defaultSmsDevisSendWaves(): SmsDevisSendWave[] {
  return [{ id: 'send-1', date: '', volume: '' }]
}

export function formatSmsDevisAmount(amount: number): string {
  return `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} € HT`
}

export function formatSmsDevisDate(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
