using BERecruitmentss.Data;
using BERecruitmentss.Models;
using Microsoft.EntityFrameworkCore;

namespace BERecruitmentss.Repository
{
    public interface IStaffRepository : IBaseRepository<Staff>
    {
        Task<string> GenerateUniqueCodeAsync();
        void Add(Staff staff);
        Task SaveChangesAsync();

    }
    public class StaffRepository : BaseRepository<Staff>, IStaffRepository
    {
        public StaffRepository(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor) : base(context, httpContextAccessor)
        {

        }
        public void Add(Staff staff)
        {
            _context.Staff.Add(staff);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<string> GenerateUniqueCodeAsync()
        {
            int newCodeNumber = 1;

            // Lặp cho đến khi tìm được mã không trùng lặp
            while (true)
            {
                // Tạo mã mới
                string newCode = $"E{newCodeNumber:D5}";

                // Kiểm tra xem mã đã tồn tại trong cơ sở dữ liệu chưa
                bool codeExists = await _context.Staff.AnyAsync(c => c.EmployeeCode == newCode);

                // Nếu mã chưa tồn tại, trả về mã mới
                if (!codeExists)
                {
                    return newCode;
                }


                newCodeNumber++;
            }
        }
    }

}
