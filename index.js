module.exports.configure = function(roles_array, errorpage) {
  // filtering roles array  for gues and blank
  let roles_array_empty_or_guest = roles_array.filter(ele => {

    if (ele.allowedroles.includes("guest") || ele.allowedroles.length == 0) {
      return ele;
    }
  })

  return function(req, res, next) {
    // checking if the current url is included in the empty array
    let filtered_zero = roles_array_empty_or_guest.filter(ele => ele.url == req.url);
    console.log("Filtered", filtered_zero);
    if (filtered_zero.length != 0) {
      /// current url is for guest // call next directly
      next();

    } else {
      console.log("This executed");

      let role = req.session.role;
      if (typeof req.session == "undefined") {
        // Throw an error express-session is needed to work with this module
        throw new Error('Session is not Defined ,Please configure Express Sessions');
      } else {

        let activated_url = req.url; // get the current requested url from request Object
        let current_role = role // get the current role from session 
        let main_activated_url = activated_url.match(/(?:^\/)?[^/]+/g)[0]
        let filtered_url = roles_array.filter(ele => ele.url == main_activated_url); // filtering the url

        if (filtered_url.length > 1) {
          /// Throws Exceptio here // 
          throw new Error('Duplicate Urls');
        } else if (filtered_url.length == 1)

        {
          console.log(filtered_url);
          console.log(req.session.role)
          // check for roles array if its empty
          if (filtered_url[0].allowedroles.length == 0 || filtered_url[0].allowedroles.includes("guest")) {
            next();
          } else {
            if (filtered_url[0].allowedroles.includes(current_role)) {
              // call the next middleware in the sequence
              next();
            } else {
              console.log("Executed");

              if (errorpage) {
                // user has given the name of error page
                // render that page
                res.rednder(errorpage);

              } else {
                res.json({
                  "message": "Unauthorized",
                  "status": 401
                });
              }


            }

          }


        } else if (filtered_url.length == 0) {
          /// Given URL is not configured for access control
          next();
        }


      }

    }





  }



}
