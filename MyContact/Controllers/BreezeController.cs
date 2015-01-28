using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Web.Http;
using Breeze.WebApi;
using CustomAttributes;
using MyContact.Entities;
using Newtonsoft.Json;
//using MyContact.Models;
using Newtonsoft.Json.Linq;
using WebMatrix.WebData;

namespace MyContact.Controllers
{
    public class MyContactEFContextProvider : EFContextProvider<AccessorEntities>
    {
        public MyContactEFContextProvider() : base() { }

        protected override bool BeforeSaveEntity(EntityInfo entityInfo)
        {
            // return false if we don’t want the entity saved.
            // prohibit any additions of entities of type 'Role'
            //if (entityInfo.EntityState == EntityState.Added)
            //{
            //    return true;
            //}
            //else
            //{
            //    return true;
            //}
         

            return true;
        }

        protected override Dictionary<Type, List<EntityInfo>> BeforeSaveEntities(Dictionary<Type, List<EntityInfo>> saveMap)
        {
            // return a map of those entities we want saved.
            Dictionary<Type, List<EntityInfo>> saveMap0 = new Dictionary<Type, List<EntityInfo>>();
            foreach (KeyValuePair<Type, System.Collections.Generic.List<Breeze.WebApi.EntityInfo>> o in saveMap)
            {
                saveMap0.Add(o.Key,o.Value);
            }
            
            
            var tag = this.SaveOptions.Tag;
            object entity = new History();
            foreach (KeyValuePair<Type, System.Collections.Generic.List<Breeze.WebApi.EntityInfo>> o in saveMap0)
            {

                List<Breeze.WebApi.EntityInfo> oval = o.Value;
                foreach (Breeze.WebApi.EntityInfo item in oval)
                {
                    if (item.EntityState == EntityState.Added)
                    {

                        //foreach ( PropertyInfo p in item.Entity.GetType().GetProperties())
                        //{
                        //    if (p.PropertyType.Name == "DateTime" && ((DateTime)item.Entity.GetType().GetRuntimeProperty(p.Name).GetValue(item.Entity)).Year < 1900)
                        //    {
                        //        item.Entity.GetType().GetRuntimeProperty(p.Name).SetValue(item.Entity, null);    
                        //    }
                        //}
                        continue;
                    }
                    else
                    {

                        foreach (KeyValuePair<string, object> originalObject in item.OriginalValuesMap)
                        {
                            if (originalObject.Key.ToString() != "IsPartial")
                            {
                                var comment = new History();
                                comment.Context = o.Key.Name;
                                switch (comment.Context)
                                {
                                    case "Contact":
                                        entity = (Contact)item.Entity;
                                        break;
                                    case "Issue":
                                        entity = (Issue)item.Entity;
                                        break;
                                    case "TimeSpent":
                                        entity = (TimeSpent)item.Entity;
                                        break;
                                }


                                comment.OldValue = originalObject.Value.ToString();
                                comment.NewValue = entity.GetType().GetProperty(originalObject.Key).GetValue(entity, null).ToString(); //t.GetProperty(originalObject.Key).ToString();
                                comment.ContextId = (int)entity.GetType().GetProperty("Id").GetValue(entity, null);
                                comment.Field = originalObject.Key;
                                comment.ChangeDate = DateTime.Now;
                                comment.ChangedBy = WebSecurity.CurrentUserId;
                                var ei = this.CreateEntityInfo(comment);
                                List<EntityInfo> comments;
                                if (!saveMap.TryGetValue(typeof(History), out comments))
                                {
                                    comments = new List<EntityInfo>();
                                    saveMap.Add(typeof(History), comments);
                                }
                                comments.Add(ei);
                            }
                        }
                    }

                }

            }



            return saveMap;
        }

        protected override void AfterSaveEntities(Dictionary<Type, List<EntityInfo>> saveMap, List<KeyMapping> keyMappings)
        {
            //// return a map of those entities we want saved.
            //Dictionary<Type, List<EntityInfo>> saveMap0 = new Dictionary<Type, List<EntityInfo>>();
            //foreach (KeyValuePair<Type, System.Collections.Generic.List<Breeze.WebApi.EntityInfo>> o in saveMap)
            //{
            //    saveMap0.Add(o.Key, o.Value);
            //}

            //object entity = new History();
            //foreach (KeyValuePair<Type, System.Collections.Generic.List<Breeze.WebApi.EntityInfo>> o in saveMap0)
            //{

            //    List<Breeze.WebApi.EntityInfo> oval = o.Value;
            //    foreach (Breeze.WebApi.EntityInfo item in oval)
            //    {
            //        if (item.EntityState != EntityState.Added) continue;

            //        var comment = new History();
            //        comment.Context = o.Key.Name;
            //        switch (comment.Context)
            //        {
            //            case "Contact":
            //                entity = (Contact)item.Entity;
            //                comment.NewValue = entity.GetType().GetProperty("Name").GetValue(entity, null).ToString(); //t.GetProperty(originalObject.Key).ToString();
            //                comment.ContextId = (int)entity.GetType().GetProperty("Id").GetValue(entity, null);
            //                comment.Field = "Name";
            //                break;
            //            case "Issue":
            //                entity = (Issue)item.Entity;
            //                comment.NewValue = entity.GetType().GetProperty("IssueSubject").GetValue(entity, null).ToString(); //t.GetProperty(originalObject.Key).ToString();
            //                comment.ContextId = (int)entity.GetType().GetProperty("Id").GetValue(entity, null);
            //                comment.Field = "IssueSubject";
            //                break;

            //        }

            //            comment.OldValue = "";
            //            comment.ChangeDate = DateTime.Now;
            //            var ei = this.CreateEntityInfo(comment);
            //            List<EntityInfo> comments;
            //            if (!saveMap.TryGetValue(typeof(History), out comments))
            //            {
            //                comments = new List<EntityInfo>();
            //                saveMap.Add(typeof(History), comments);
            //            }
            //            comments.Add(ei);
                    
            //    }
            //}
          
        }
    }

    
    [Authorize]
    [BreezeController]
    public class BreezeController : ApiController
    {

        readonly  MyContactEFContextProvider _contextProvider =
            new MyContactEFContextProvider();

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
        [HttpGet]
        public IQueryable<History> Histories()
        {
            return _contextProvider.Context.Histories;

        }
        [HttpGet]
        public IQueryable<TimeSpent> TimeSpents()
        {
            return _contextProvider.Context.TimeSpents;

        }
        [HttpGet]
        public IQueryable<User> GetCurrentUserDetails()
        {
            return _contextProvider.Context.Users.Where<User>(t => t.Id == WebSecurity.CurrentUserId);

        }
        [HttpGet]
        public object Lookups()
        {
            var users = _contextProvider.Context.Users;
            var issues = _contextProvider.Context.Issues;
            var histories = _contextProvider.Context.Histories;
            var timespents = _contextProvider.Context.TimeSpents ;
            return new { users, issues, histories, timespents };
        }


        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
      
            return _contextProvider.SaveChanges(saveBundle);
           //
        }
      
        //protected override Dictionary<Type, List<EntityInfo>> BeforeSaveEntities(Dictionary<Type, List<EntityInfo>> saveMap)
        //{
        //    var comment = new History();
        //    var tag = _contextProvider.SaveOptions.Tag;
        //    comment.OldValue = (tag == null) ? "Generic comment" : tag.ToString();
        //    comment.NewValue = (tag == null) ? "Generic comment" : tag.ToString();
        //    comment.ContextId = 1;
        //    comment.Context = "test";
        //    comment.ChangeDate = DateTime.Now;

        //    var ei = _contextProvider.CreateEntityInfo(comment);
        //    List<EntityInfo> comments;
        //    if (!saveMap.TryGetValue(typeof(History), out comments))
        //    {
        //        comments = new List<EntityInfo>();
        //        saveMap.Add(typeof(History), comments);
        //    }
        //    comments.Add(ei);

        //    return saveMap;
        //}    
        //private List<History> GenerateHistory(JObject saveBundle)
        //{
        //    List<History> historyList = new List<History>();
            
        //    string context = (string)saveBundle.SelectToken("entities[0].entityAspect.defaultResourceName");
        //    int contextId = (int)saveBundle.SelectToken("entities[0].Id");
        //    object o = new History();

        //    switch (context)
        //    {
        //        case "Contacts":
        //            o = new Contact();
        //            break;
        //        case "Issues":
        //             o = new Issue();
        //            break;
             
        //    }
        //    string found;
        //    Type type = o.GetType();
        //    foreach (PropertyInfo info in type.GetProperties())
        //    {

        //        if (info.GetCustomAttribute<RequiredForJson>() != null)
        //        {
        //            found = (string)saveBundle.SelectToken("entities[0].entityAspect.originalValuesMap." + info.Name);
        //            if (found != null)
        //            {

        //                History h = new History();
        //                h.Context = context;
        //                h.ContextId = contextId;
        //                h.Field = info.Name;
        //                h.OldValue = (string)saveBundle.SelectToken("entities[0].entityAspect.originalValuesMap." + info.Name);
        //                h.NewValue = (string)saveBundle.SelectToken("entities[0]." + info.Name);
        //               //object x= _contextProvider.CreateEntityInfo(h, EntityState.Added);
        //               //JObject xy = JsonConvert.SerializeObject(

        //                historyList.Add(h);
        //            }
        //        }
        //    }

            


          




            
        //    return historyList;
        //}

        //[HttpGet]
        //public Contact CreateContact() 
        //{
        //    return new Contact();
        //}

//    saveBundle	{
//  "entities": [
//    {
//      "Id": -1,
//      "Name": "test",
//      "Mobile": "1231231231",
//      "Email": "asg@asg.net",
//      "__unmapped": {
//        "isPartial": false
//      },
//      "entityAspect": {
//        "entityTypeName": "Contact:#MyContact.Entities",
//        "defaultResourceName": "Contacts",
//        "entityState": "Added",
//        "originalValuesMap": {},
//        "autoGeneratedKey": {
//          "propertyName": "Id",
//          "autoGeneratedKeyType": "Identity"
//        }
//      }
//    }
//  ],
//  "saveOptions": {}
//}	Newtonsoft.Json.Linq.JObject


    }
}
