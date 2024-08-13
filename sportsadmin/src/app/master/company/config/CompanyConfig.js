class CompanyTableConfig {
    //To get all company
      getAllCompany(){
          return{
              method:"GET",
              url:"company//getAll",
              headers:{"Content-Type": "application/json"},
              baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
  
          };
      }
    }     
    
    
  export default new  CompanyTableConfig();  