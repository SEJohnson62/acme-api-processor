// Initialize interactive screen
const submit = document.querySelector('#submit-button');
const mainPanel = document.querySelector('#main-panel');

// Initialize query URLs
const baseURL = 'https://acme-users-api-rev.herokuapp.com';
const companiesURL = '/api/companies';
const productsURL = '/api/products';
const offeringsURL = '/api/offerings';

let companyObjs = [{
  id: '',
  name: '',
  phone: '',
  state: '',
  catchPhase: ''
}];

let productObjs = [{
  id: '',
  name: '',
  description: '',
  suggestedPrice: 0.00
}];

let offeringObjs = [{
  id: '',
  price: 0.00,
  productID: '',
  companyID: ''
}];

const loadData = async() => {
  const companyList = axios.get(`${baseURL}${companiesURL}`)
  const productList = axios.get(`${baseURL}${productsURL}`)
  const offeringsList = axios.get(`${baseURL}${offeringsURL}`)

  const allResults = await Promise.all( [companyList, productList, offeringsList]);

  // copy company data into company object array

  companyObjs = allResults[0].data;
  /*for( i = 0; i < allResults[0].data.length; i++ ) {
    companyObjs[i].name = allResults[0].data[i].name;
    companyObjs[i].id = allResults[0].data[i].id;
    console.log(companyObjs[i]);
  }*/

  // copy product data into product object array
  productObjs = allResults[1].data;

  // copy company product offerings into offeringObj array
  offeringObjs = allResults[2].data;

  console.log("This database contains", companyObjs.length," companies.");
  console.log("This database contains", productObjs.length," products.");
  console.log("This database contains", offeringObjs.length," offerings.");

  return;
}

submit.addEventListener('click',loadData);

//return products within a price range
function findProductsInPriceRange( productObjs, rangeObj){
  let outProducts = [];
  for( i = 0; i < productObjs.length; i++) {
    if( productObjs[i].suggestedPrice < rangeObj.max ) {
      outProducts.push(productObjs[i]);
    }
  }
  return outProducts;
}
/*const productsInPriceRange = findProductsInPriceRange( productObjs, { min: 1, max: 15});
console.log( productsInPriceRange );*/

//returns object where key is first letter of company name
//value for each key is the array of those companies
function groupCompaniesByLetter( companyObjs ) {
  let compObjArr = [{
    key: ' ',
    value: []
  }];
  let compObj = {
    key: ' ',
    value: []
  };

  for( i = 0; i < companyObjs.length; i++ ) {
    switch ( companyObjs[i].name[0] ) {
      case 'A' || 'a':
        compObj.key = 'A'
        compObj.value = companyObjs[i];
        compObjArr.push(compObj);
        break;
      case 'B' || 'b':
      case 'C' || 'c':
      case 'D' || 'd':
      case 'E' || 'e': break;
      case 'F' || 'f': break;
    }
  }
  return compObjArr;
}
/*const groupedCompaniesByLetter = groupCompaniesByLetter( companyObjs );
console.log( groupedCompaniesByLetter );*/

//returns object where key is a state
//value for each key is the array of those companies in that state
function groupCompaniesByState( companyObjs ) {

}
/*const groupedCompaniesByState = groupCompaniesByState( companyObjs );
console.log( groupedCompaniesByState );*/

//returns an array of the offerings with each offering having a company and product
function processOfferings( offeringObjs ) {}
/*const processedOfferings = processOfferings({ companyObjs, productObjs, offeringObjs });
console.log( processedOfferings );*/

//returns the companies that have n or more offerings
function companiesByNumberOfOfferings( companyObjs, offeringObjs, minNum) {}
/*const threeOrMoreOfferings = companiesByNumberOfOfferings( companyObjs, offeringObjs, 3);
console.log( threeOrMoreOfferings );*/

//returns array of products where each product has the average price of it's offerings
function processProducts( productObjs, offeringObjs ) {}
/*const processedProducts = processProducts({ productObjs, offeringObjs });
console.log( processedProducts );*/


//Sample query
/*const companiesByState = (companies, state)=> companies.filter(company => company.state === state );
const companiesInTexas = companiesByState( companies, 'Texas');
console.log( companiesInTexas );*/
