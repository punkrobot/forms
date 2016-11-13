export default class Utils {

  static getCookie(name,c,C,i) {
    let cookies = {}

    c = document.cookie.split('; ');

    for(i=c.length-1; i>=0; i--){
       C = c[i].split('=');
       cookies[C[0]] = C[1];
    }

    return cookies[name];
  }

}