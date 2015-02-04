using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Runtime.Serialization;
using System.Security.Principal;

namespace MyContact.Entities
{
    public partial class AccessorEntities : DbContext
    {
        public static User CurrentUser { get; set; }

        public class RegisterExternalLoginModel
        {
            [Required]
            [Display(Name = "User name")]
            public string UserName { get; set; }

            public string ExternalLoginData { get; set; }
        }

        public class LocalPasswordModel
        {
            [Required]
            [DataType(DataType.Password)]
            [Display(Name = "Current password")]
            public string OldPassword { get; set; }

            [Required]
            [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
            [DataType(DataType.Password)]
            [Display(Name = "New password")]
            public string NewPassword { get; set; }

            [DataType(DataType.Password)]
            [Display(Name = "Confirm new password")]
            [Compare("NewPassword", ErrorMessage = "The new password and confirmation password do not match.")]
            public string ConfirmPassword { get; set; }
        }

        public class LoginModel
        {
            [Required]
            [Display(Name = "User name")]
            public string UserName { get; set; }

            [Required]
            [DataType(DataType.Password)]
            [Display(Name = "Password")]
            public string Password { get; set; }

            [Display(Name = "Remember me?")]
            public bool RememberMe { get; set; }
        }

        public class RegisterModel
        {
            [Required]
            [Display(Name = "User name")]
            public string UserName { get; set; }

            [Required]
            [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
            [DataType(DataType.Password)]
            [Display(Name = "Password")]
            public string Password { get; set; }

            [DataType(DataType.Password)]
            [Display(Name = "Confirm password")]
            [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
            public string ConfirmPassword { get; set; }
        }

        public class ExternalLogin
        {
            public string Provider { get; set; }
            public string ProviderDisplayName { get; set; }
            public string ProviderUserId { get; set; }
        }
    }
    [Serializable]
    [DataContract]
    public class CustomPrincipalSerializeModel
    {
        #region Private Members

        /// <summary>
        /// The user identifier
        /// </summary>
        private int userId;

        /// <summary>
        /// The user name
        /// </summary>
        private string userName;

        /// <summary>
        /// user id at DB
        /// </summary>
        private int id;

        /// <summary>
        /// The allowed modules
        /// </summary>
        private int domainId;


        #endregion

        #region Public Properties

        /// <summary>
        /// Gets or sets the user identifier.
        /// </summary>
        /// <value>
        /// The user identifier.
        /// </value>
        public int UserId
        {
            get
            {
                return this.userId;
            }

            set
            {
                this.userId = value;
            }
        }

        /// <summary>
        /// Gets or sets the username.
        /// </summary>
        /// <value>
        /// The username.
        /// </value>
        public string Username
        {
            get
            {
                return this.userName;
            }

            set
            {
                this.userName = value;
            }
        }

        /// <summary>
        /// Gets or sets the allowed modules.
        /// </summary>
        /// <value>
        /// The allowed modules.
        /// </value>
        public int DomainId
        {
            get
            {
                return this.domainId;
            }

            set
            {
                this.domainId = value;
            }
        }

        /// <summary>
        /// Gets or sets the Id
        /// </summary>
        /// <value>
        /// returns  Id
        /// </value>
        public int Id
        {
            get
            {
                return this.id;
            }

            set
            {
                this.id = value;
            }
        }

        /// <summary>
        /// Gets or sets product group code for user
        /// </summary>
      

        #endregion
    }

    public class CustomPrincipal : ICustomPrincipal
    {
        #region Private Members

        /// <summary>
        /// The user identifier
        /// </summary>
        private int userId;

        /// <summary>
        /// The user name
        /// </summary>
        private string userName;

        /// <summary>
        /// The identity
        /// </summary>
        private IIdentity identity;

        /// <summary>
        /// The allowed modules
        /// </summary>
        private int domainId;

        /// <summary>
        /// id of user in local table
        /// </summary>
        private int id;


        #endregion

        #region Constructor

        /// <summary>
        /// Initializes a new instance of the <see cref="CustomPrincipal"/> class.
        /// </summary>
        /// <param name="userName">The user name.</param>
        public CustomPrincipal(string userName)
        {
            this.Identity = new GenericIdentity(userName);
        }

        #endregion

        #region Public Properties

        /// <summary>
        /// Gets the identity of the current principal.
        /// </summary>
        /// <returns>The <see cref="T:System.Security.Principal.IIdentity" /> object associated with the current principal.</returns>
        public IIdentity Identity
        {
            get
            {
                return this.identity;
            }

            private set
            {
                this.identity = value;
            }
        }

        /// <summary>
        /// Gets or sets the user identifier.
        /// </summary>
        /// <value>
        /// The user identifier.
        /// </value>
        public int UserId
        {
            get
            {
                return this.userId;
            }

            set
            {
                this.userId = value;
            }
        }

        /// <summary>
        /// Gets or sets the username.
        /// </summary>
        /// <value>
        /// The username.
        /// </value>
        public string Username
        {
            get
            {
                return this.userName;
            }

            set
            {
                this.userName = value;
            }
        }

        /// <summary>
        /// Gets or sets the allowed modules.
        /// </summary>
        /// <value>
        /// The allowed modules.
        /// </value>
        public int DomainId
        {
            get
            {
                return this.domainId;
            }

            set
            {
                this.domainId = value;
            }
        }

        /// <summary>
        /// Gets or sets the id of user in local table
        /// </summary>
        public int Id
        {
            get
            {
                return this.id;
            }

            set
            {
                this.id = value;
            }
        }

       
        

        /// <summary>
        /// Determines whether the current principal belongs to the specified role.
        /// </summary>
        /// <param name="role">The name of the role for which to check membership.</param>
        /// <returns>
        /// true if the current principal is a member of the specified role; otherwise, false.
        /// </returns>
        public bool IsInRole(string role)
        {
            return false;
        }

        #endregion
    }
}
