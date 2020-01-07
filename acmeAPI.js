// Initialize interactive screen
const submit = document.querySelector('#submit-button');
const mainPanel = document.querySelector('#main-panel');

// Initialize query URLs
const baseURL = 'https://acme-users-api-rev.herokuapp.com';
const companiesURL = '/api/companies';
const productsURL = '/api/products';
const offeringsURL = '/api/offerings';

const loadData = async() => {
  const companyList = axios.get(`${baseURL}${companiesURL}`)
  const productList = axios.get(`${baseURL}${productsURL}`)
  const offeringsList = axios.get(`${baseURL}${offeringsURL}`)

  const allResults = await Promise.all( [companyList, productList, offeringsList]);
  console.log(companyList);
  console.log(productList);
  console.log(offeringsList);
  return allResults;
}


submit.addEventListener('click',loadData);

/*

//return products within a price range
function findProductsInPriceRange( products, rangeObj){}
const productsInPriceRange = findProductsInPriceRange( products, { min: 1, max: 15});
console.log( productsInPriceRange );

//returns object where key is first letter of company name
//value for each key is the array of those companies
function groupCompaniesByLetter( companies ) {}
const groupedCompaniesByLetter = groupCompaniesByLetter( companies );
console.log( groupedCompaniesByLetter );

//returns object where key is a state
//value for each key is the array of those companies in that state
function groupCompaniesByState( companies ) {}
const groupedCompaniesByState = groupCompaniesByState( companies );
console.log( groupedCompaniesByState );

//returns an array of the offerings with each offering having a company and product
function processOfferings( offeringsObj ) {}
const processedOfferings = processOfferings({ companies, products, offerings });
console.log( processedOfferings );

//returns the companies that have n or more offerings
function companiesByNumberOfOfferings( companies, offerings, minNum) {}
const threeOrMoreOfferings = companiesBuNumberOfOfferings( companies, offerings, 3);
console.log( threeOrMoreOfferings );

//returns array of products where each product has the average price of it's offerings
function processProducts( products, offerings ) {}
const processedProducts = processProducts({ products, offerings });
console.log( processedProducts );


//Sample query
/*const companiesByState = (companies, state)=> companies.filter(company => company.state === state );
const companiesInTexas = companiesByState( companies, 'Texas');
console.log( companiesInTexas );*/
