//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace MyContact.Entities
{
    using System;
    using System.Collections.Generic;
    
    public partial class User
    {
        public User()
        {
            this.Issues = new HashSet<Issue>();
            this.IssueComments = new HashSet<IssueComment>();
            this.TimeSpents = new HashSet<TimeSpent>();
        }
    
        public int Id { get; set; }
        public string UserName { get; set; }
        public string DisplayName { get; set; }
        public bool Active { get; set; }
        public System.DateTime CreateDate { get; set; }
    
        public virtual ICollection<Issue> Issues { get; set; }
        public virtual ICollection<IssueComment> IssueComments { get; set; }
        public virtual ICollection<TimeSpent> TimeSpents { get; set; }
        public virtual UserProfile UserProfile { get; set; }
    }
}
