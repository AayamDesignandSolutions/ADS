using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyContact.Controllers;
using MyContact.Entities;
using WebMatrix.WebData;

namespace MyContact.Provider
{
    public class ExtendedMembership : SimpleMembershipProvider
    {

        public override bool ValidateUser(string login, string password)
        {
            bool result;
            // check to see if the login passed is an email address

            //string actualUsername = base.GetUserNameByEmail(login);
            //return base.ValidateUser(actualUsername, password);

          result= base.ValidateUser(Base64Encode(login), password);
          if (result)
          {
              System.Web.Security.MembershipUser user = base.GetUser(Base64Encode(login), true);
              BreezeController b = new BreezeController();
              IQueryable<User> u = b.GetCurrentUserDetails((int)user.ProviderUserKey);
              result = u.FirstOrDefault<User>().Active == true;

          }
              return result; 
            //return true;

        }

        public override string CreateAccount(string userName, string password)
        {

            return base.CreateAccount(Base64Encode(userName), password);
        }

        public override string CreateUserAndAccount(string userName, string password)
        {                      
            return base.CreateUserAndAccount(Base64Encode(userName), password);
        }

        //public override string CreateUserAndAccount(string userName, string password, object propertyValues = null, bool requireConfirmationToken = false)
        //{
        //    return base.CreateUserAndAccount(Base64Encode(userName), password);
        //}

        public static string Base64Encode(string plainText)
        {
            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
            return System.Convert.ToBase64String(plainTextBytes);
        }
        public static string Base64Decode(string base64EncodedData)
        {
            var base64EncodedBytes = System.Convert.FromBase64String(base64EncodedData);
            return System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
        }
    }
}

