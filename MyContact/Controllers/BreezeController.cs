using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Breeze.WebApi;
using MyContact.Entities;
//using MyContact.Models;
using Newtonsoft.Json.Linq;

namespace MyContact.Controllers
{
    [BreezeController]
    public class BreezeController : ApiController
    {

        readonly EFContextProvider<AccessorEntities> _contextProvider =
            new EFContextProvider<AccessorEntities>();

        [HttpGet]
        public string Metadata()
        {
            return _contextProvider.Metadata();

        }

        [HttpGet]
        public IQueryable<Contact> Contacts()
        {
            return _contextProvider.Context.Contacts;

        }
        [HttpGet]
        public IQueryable<User> Users()
        {
            return _contextProvider.Context.Users;

        }
        [HttpGet]
        public IQueryable<Issue> Issues()
        {
            return _contextProvider.Context.Issues;

        }
        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            return _contextProvider.SaveChanges(saveBundle);

        }

        //[HttpGet]
        //public Contact CreateContact() 
        //{
        //    return new Contact();
        //}


    }
}
