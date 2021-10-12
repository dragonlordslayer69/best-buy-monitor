const axios = require('axios');
let isInStock = false;

async function sendRequest() {
    const skus = require('./skus.json');
    let data = await axios({
        method: "GET",
        url: `https://www.bestbuy.com/api/3.0/priceBlocks?skus=${skus.skus}`,
        headers: {
            "User-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"
        }
    }).catch(err => {
        console.log(err.message);
    });

    return data.data;
}

function processData(data) {

    if (data.sku.buttonState.purchasable == true && !isInStock) {
        console.log(`Product found in stock: ${data.sku.names.short} with SKU ${data.sku.buttonState.skuId}`);
        console.log(`ATC Link: https://api.bestbuy.com/click/~/${data.sku.buttonState.skuId}/cart`)
        console.log(`Product Link: https://bestbuy.com/site/~/${data.sku.buttonState.skuId}.p`)
        isInStock = !isInStock;
    } else if (data.sku.buttonState.buttonState == "SOLD_OUT") {
        // console.log(`Sku ${data.sku.buttonState.skuId} is OOS`);
        isInStock = false;
    }
}

async function flow() {
    let info = await sendRequest();

    processData(info[0]);
}


console.log(`Monitor starting...`)

flow();

setInterval(() => {
    flow();
}, 10000)