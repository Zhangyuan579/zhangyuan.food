function bestCharge(selectedItems) {
    let items = [];
    selectedItems.map((element, index) => {
        items.push(loadAllItems().filter(filteritems => filteritems.id === element.split("x")[0].trim() | Object.assign(filteritems, {
            count: element.split("x")[1].trim(),
            subtotal: Number(element.split("x")[1].trim() * Number(filteritems.price))
        })));
    });

    //优惠价钱
    //获取最佳优惠
    let discountItems = get_the_best_discount(items);

    //拼接商品信息
    return splicing_commodity_information(discountItems, items);;
}


function get_the_best_discount(discountItem) {
    let type = []; //类型
    let discountItems;
    let rreferentialPriceOne = 0; //优惠价钱
    let rreferentialPriceTwo = 0; //优惠价钱
    //第一种优惠，指定菜品半价
    //1、获取类型
    for (let i = 0; i < loadPromotions().length; i++) {
        if (loadPromotions()[i].type === "指定菜品半价") {
            discountItems = loadPromotions()[i].items;
        }
    }

    //2、计算优惠
    discountItem.map(item => {
        discountItems.map(itemD => {
            if (item[0].id === itemD) {
                type.push(item[0].name);
                rreferentialPriceOne += (Number(item[0].subtotal) / 2);
            }
        })
    });
    //第二种优惠，满30减6元
    for (let i = 0; i < discountItem.length; i++) {
        rreferentialPriceTwo += parseInt(discountItem[i][0].subtotal);
    }
    if (rreferentialPriceTwo >= 30) {
        rreferentialPriceTwo = 6;
    } else {
        rreferentialPriceTwo = 0;
    }


    if (rreferentialPriceTwo === 0 && rreferentialPriceOne === 0) {
        return { rreferentialPrice: 0, type: "" };
    } else {
        if (rreferentialPriceOne > rreferentialPriceTwo) {
            let name = "";
            for (let it of type) {
                name += it;
                name += "，";
            }
            let kk = name.substring(0, name.length - 1);

            return { rreferentialPrice: rreferentialPriceOne, type: `指定菜品半价(` + kk + `)，省` + rreferentialPriceOne + `元` }
        } else {
            return { rreferentialPrice: rreferentialPriceTwo, type: `满30减6元，省` + rreferentialPriceTwo + `元` }
        }
    }
}

function splicing_commodity_information(discountItems, items) {
    let html_head = `============= 订餐明细 =============\n`;
    let html_middle = `-----------------------------------\n`;
    let html_tail = `===================================\n`;
    let html_item = "";

    let html_rrferen = `使用优惠:
    ${discountItems.type}\n`;
    let sumPrice = 0;

    items.map(item => {
        html_item += `${item[0].name} x ${item[0].count} = ${item[0].subtotal}元\n`;
        sumPrice += item[0].subtotal;
    })
    let html_sum = `总计：${sumPrice - discountItems.rreferentialPrice}元\n`;


    return html_head + html_item + html_middle + (discountItems.rreferentialPrice === 0 ? "" : (html_rrferen + html_middle)) + html_sum + html_tail;
}