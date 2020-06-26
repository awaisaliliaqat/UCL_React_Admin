
import axios from 'axios';
const request =  props => {
    const { method, data, endPoint } = props;
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/${endPoint}`
    axios({
        method,
        url,
        data
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

}

export default request;