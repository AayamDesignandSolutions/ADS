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
    
    public partial class Issue
    {
        public int Id { get; set; }
        public string IssueSubject { get; set; }
        public string IssueDetails { get; set; }
        public int AssignedTo { get; set; }
        public System.DateTime CreatedDate { get; set; }
    
        public virtual User User { get; set; }
    }
}
