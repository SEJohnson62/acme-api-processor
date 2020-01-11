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

  // copy product data into product object array
  productObjs = allResults[1].data;

  // copy company product offerings into offeringObj array
  offeringObjs = allResults[2].data;

  console.log("This database contains", companyObjs.length," companies.");
  /*displayCompanies( companyObjs );*/
  console.log("This database contains", productObjs.length," products.");
  /*displayProducts( productObjs );*/
  console.log("This database contains", offeringObjs.length," offerings.");
  const processedOfferings = processOfferings( offeringObjs, companyObjs );
  /*displayOfferings( processedOfferings );*/
  return;
}

function displayOfferings( ) {
  console.log("In displayOfferings");
  let html = '';
  console.log("offeringObjs.length = ",offeringObjs.length);
//Each product has multiple entries, so a sort by product is needed
//to make the display easier to read
  html += `<div class="card">`
  for( i = 0; i < offeringObjs.length; i++ ){
    html+= `<h4>${offeringObjs[i].product.name}</h4>`;
    html+= `<li>${offeringObjs[i].company.name}$${offeringObjs[i].price}</li>`
  }
  html += `</div>`
  html = html.toString();
  mainPanel.innerHTML += html;
}

function displayCompanies (compObjs) {
  let html = '';
    for( i = 0; i < compObjs.length; i++ ) {
      html +=
      `<div class="card">
      <h4>${compObjs[i].name}</h4>
      <h5>${compObjs[i].phone} ${compObjs[i].state}</h5>
      </div>`;
      html = html.toString();
    }
    mainPanel.innerHTML += html;
}
function displayCompaniesAlphabetically( alphaSortedCompanyObjects ){
  displayCompanies( alphaSortedCompanyObjects.value );
}
function displayCompaniesByState( groupedCompaniesByState ) {
  displayCompanies( groupedCompaniesByState )
}

function displayProducts (productObjs) {
  let html = '';
  for( i = 0; i < productObjs.length; i++ ) {
      html +=
      `<div class="card">
      <h4>${productObjs[i].name}: $${productObjs[i].suggestedPrice}</h4>
      </div>`;
      html = html.toString();
  }
  mainPanel.innerHTML += html;
}

function productQueries( productObjs ) {
  //make queries
  const productsInPriceRange = findProductsInPriceRange( productObjs, { min: 1, max: 15});
  mainPanel.innerHTML += `Here are ${productsInPriceRange.length} products under $15:`
  displayProducts(productsInPriceRange);
}

function companyQueries( ) {
  const groupedCompaniesByLetter = groupCompaniesByLetter( companyObjs );
  /*mainPanel.innerHTML += `Here are the companies grouped by first letter:`
  //display each subarray
  Object.entries(groupedCompaniesByLetter).forEach (function (company) {
    console.log(company[0]);
    displayCompanies( company[1] );
  })
  displayCompanies( groupedCompaniesByLetter );*/

  const groupedCompaniesByState = groupCompaniesByState( companyObjs );
  mainPanel.innerHTML = `Here are the companies grouped by State`;
  //display each subarray
  Object.entries(groupedCompaniesByState).forEach (function (company) {
    console.log(company[0]);
    displayCompanies( company[1] );
  })
  displayCompanies( groupedCompaniesByState );
}

const getOffers = async () => {
  await loadData();
  companyQueries();
  /*productQueries(productObjs);*/

}
submit.addEventListener('click',getOffers);

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

//returns object where key is first letter of company name
//value for each key is the array of those companies
function groupCompaniesByLetter( companyObjs ) {
  const compObj = {};

  console.log("Group these ", companyObjs.length," by first letter.");
  for( i = 0; i < companyObjs.length; i++ ) {
    const letter = companyObjs[i].name[0];
    if( compObj[letter] ) {
      // add element to current array
      compObj[letter].push(companyObjs[i]);
    } else {
      // start new group
      compObj[letter] = [companyObjs[i]];
    }

  }
  return compObj;
}


//returns object where key is a state
//value for each key is the array of those companies in that state
function groupCompaniesByState( companyObjs ) {
  const compObj = {};

  console.log("Group these ", companyObjs.length," by state.");
  for( i = 0; i < companyObjs.length; i++ ) {
    const state = companyObjs[i].state;
    if( compObj[state] ) {
      // add element to current array
      compObj[state].push(companyObjs[i]);
    } else {
      // start new group
      compObj[state] = [companyObjs[i]];
    }

  }
  return compObj;
}

//returns an array of the offerings with each offering having a company and product
function processOfferings( offeringObjs , companyObjs ) {

  offeringObjs.forEach( offer => {
    // first add companyObjs to the offeringObjs
    companyObjs.forEach( comp => {
      if ( offer.companyId === comp.id ){
          offer.company = comp;
      }
    })
    // then add productObjs to the offeringObjs
    productObjs.forEach( product => {
      if ( offer.productId === product.id ) {
        offer.product = product;
      }
    })
  })
  return offeringObjs;
}




//returns the companies that have n or more offerings
function companiesByNumberOfOfferings( companyObjs, offeringObjs, minNum) {
  const compObjArr = [];
  return compObjArr;
}
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
