export const TYPE = {
  dSingle: 'Digital Edition (single copy)',
  dSingleAR: 'Digital Edition (single copy)',
  dSingleEnAr: 'Digital Edition (single copy)',
  dSubs: 'Digital Subscription',
  dSubsAR: 'Digital Subscription',
  dSubsEnAr: 'Digital Subscription',
  pSingle: 'Print Edition (single copy)',
  pSingleAR: 'Print Edition (single copy)',
  pSingleEnAr: 'Print Edition (single copy)',
  pSubs: 'Print Subscription',
  pSubsAR: 'Print Subscription',
  pSubsEnAr: 'Print Subscription',
}

export const LANG = {
  dSingle: 'English',
  dSingleAR: 'Arabic',
  dSingleEnAr: 'English, Arabic',
  dSubs: 'English',
  dSubsAR: 'Arabic',
  dSubsEnAr: 'English, Arabic',
  pSingle: 'English',
  pSingleAR: 'Arabic',
  pSingleEnAr: 'English, Arabic',
  pSubs: 'English',
  pSubsAR: 'Arabic',
  pSubsEnAr: 'English, Arabic',
}

export const FLAGS = {
  DIGITAL : {
    SINGLE: {
      EN: 'dSingle',
      AR: 'dSingleAR',
      ENAR: 'dSingleEnAr'
    },
    SUB: {
      EN: 'dSubs',
      AR: 'dSubsAR',
      ENAR: 'dSubsEnAr',
    },
  },
  PRINT: {
    SINGLE: {
      EN: 'pSingle',
      AR: 'pSingleAR',
      ENAR: 'pSingleEnAr'
    },
    SUB: {
      EN: 'pSubs',
      AR: 'pSubsAR',
      ENAR: 'pSubsEnAr',
    },
  }
}

export const INPUT_LANG = {
  dSingle: ['en'],
  dSingleAR: ['ar'],
  dSingleEnAr: ['en','ar'],
  dSubs: ['en'],
  dSubsAR: ['ar'],
  dSubsEnAr: ['en','ar'],
  pSingle: ['en'],
  pSingleAR: ['ar'],
  pSingleEnAr: ['en','ar'],
  pSubs: ['en'],
  pSubsAR: ['ar'],
  pSubsEnAr: ['en','ar'],
}

export const INPUT_TYPE = {
  dSingle: 'D',
  dSingleAR: 'D',
  dSingleEnAr: 'D',
  dSubs: 'D',
  dSubsAR: 'D',
  dSubsEnAr: 'D',
  pSingle: 'P',
  pSingleAR: 'P',
  pSingleEnAr: 'P',
  pSubs: 'P',
  pSubsAR: 'P',
  pSubsEnAr: 'P',
}

export const isUnAvailable = (region, type) => {
  if('D' === type) {
    return (
      ( region.dSingle ==  0 || region.dSingleAR == 0 || region.dSingleEnAr == 0 ) ||
      ( region.dSubs ==  0 || region.dSubsAR == 0 || region.dSubsEnAr == 0 )
    )
  } else {
    return (
      ( region.pSingle ==  0 || region.pSingleAR == 0 || region.pSingleEnAr == 0 ) ||
      ( region.pSubs ==  0 || region.pSubsAR == 0 || region.pSubsEnAr == 0 )
    )
  }
}
