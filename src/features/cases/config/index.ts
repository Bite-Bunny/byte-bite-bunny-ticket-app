export interface RarityStyles {
  bg: string
  border: string
  text: string
  label: string
}

export const rarityStyles = {
  common: {
    bg: 'bg-gray-500/20',
    border: 'border-gray-400/30',
    text: 'text-gray-300',
    label: 'Common',
  },
  uncommon: {
    bg: 'bg-green-500/20',
    border: 'border-green-400/30',
    text: 'text-green-300',
    label: 'Uncommon',
  },
  rare: {
    bg: 'bg-blue-500/20',
    border: 'border-blue-400/30',
    text: 'text-blue-300',
    label: 'Rare',
  },
  epic: {
    bg: 'bg-purple-500/20',
    border: 'border-purple-400/30',
    text: 'text-purple-300',
    label: 'Epic',
  },
  legendary: {
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-400/30',
    text: 'text-yellow-300',
    label: 'Legendary',
  },
}
