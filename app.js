async function getStockInfoByCardId(id) {
    let response = await fetch(`https://basket-10.wb.ru/vol1469/part146972/${id}/info/ru/card.json`)
    const items = await response.json()

    const itemIds = items.colors.join(';')
    response = await fetch(`https://card.wb.ru/cards/v1/detail?appType=1&curr=rub&dest=-1257786&spp=27&nm=${itemIds}`)
    const { data } = await response.json()
    
    response = await fetch('https://static-basket-01.wbbasket.ru/vol0/data/stores-data.json')
    const storesInfo = await response.json()

    const storeId = storesInfo.find(store => store.name === 'Казань WB').id

    return data.products.map(element => {
        const artId = element.id || '';
        const stockInfo = {}
    
        if (element.sizes) {
          element.sizes.forEach(size => {
            const stock = size.stocks.find(stock => stock.wh === storeId)
            stockInfo[size.origName] = stock ? stock.qty || 0 : 0
          })
        }
    
        return { art: artId, stock: stockInfo }
      });
}


getStockInfoByCardId('146972802').then(stockInfo => console.log(stockInfo))