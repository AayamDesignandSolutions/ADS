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
    using CustomAttributes;
    
    public partial class History
    {
        public int Id { get; set; }
        [RequiredForJson]
        public string Context { get; set; }
        [RequiredForJson]
        public string Field { get; set; }
        [RequiredForJson]
        public int ContextId { get; set; }
        [RequiredForJson]
        public string OldValue { get; set; }
        [RequiredForJson]
        public string NewValue { get; set; }
        public System.DateTime ChangeDate { get; set; }
    }
}
