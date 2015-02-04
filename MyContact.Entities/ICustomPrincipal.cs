using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace MyContact.Entities
{
    /// <summary>
    /// Custom principal interface
    /// </summary>
    public interface ICustomPrincipal : IPrincipal
    {
        /// <summary>
        /// Gets or sets the user identifier.
        /// </summary>
        /// <value>
        /// The user identifier.
        /// </value>
        int UserId { get; set; }

        /// <summary>
        /// Gets or sets the username.
        /// </summary>
        /// <value>
        /// The username.
        /// </value>
        string Username { get; set; }

        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        int Id { get; set; }

        /// <summary>
        /// Gets or sets the product group codes.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        int DomainId { get; set; }
    }
}
