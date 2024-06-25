using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace BERecruitmentss.Models
{
    [Table("Users")]
    public class Users : Base{ 
        public string? Code { get; set; }
        public DateTime? Dob { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
        public int? Role { get; set; }
    }
}
