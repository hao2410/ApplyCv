using BERecruitmentss.Data;
using BERecruitmentss.Models;
using Microsoft.EntityFrameworkCore;

namespace BERecruitmentss.Repository
{
 
        public interface IEmailRepository
        {
            Task<Staff> GetUserByEmailAsync(string email);
            Task UpdateUserAsync(Staff user);
            // Các phương thức khác liên quan đến quản lý người dùng
        }

        public class EmailRespository : IEmailRepository
        {
            private readonly ApplicationDbContext _context;

            public EmailRespository(ApplicationDbContext context)
            {
                _context = context;
            }

            public async Task<Staff> GetUserByEmailAsync(string email)
            {
                return await _context.Staff.SingleOrDefaultAsync(u => u.Email == email);
            }

            public async Task UpdateUserAsync(Staff user)
            {
                _context.Staff.Update(user);
                await _context.SaveChangesAsync();
            }

        }
    
}
