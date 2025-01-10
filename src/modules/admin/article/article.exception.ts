export enum ArticleException {
  EA001 = 'AE001', // article not exist
  EA002 = 'AE002', // validate failed
  EAIStopSale = 'EAIStopSale', // article is stop sale
  EAIMissUserAndBankAccountInfo = 'EAIMissUserAndBankAccountInfo', // user and bank account info is missing
  EAIMissUserRequireInfo = 'EAIMissUserRequireInfo', // user require info is missing
  WAMissUserBankAccountInfo = 'WAMissUserBankAccountInfo', // user bank account info is missing
  EAIMissProductInfoScreen1 = 'EAIMissProductInfoScreen1', // product info is missing (title or content)
  EAIMissProductInfoScreen2 = 'EAIMissProductInfoScreen2', // product info is missing (others)
  EAIProductHasSale = 'EAIProductHasSale', // product has sale
}
