using BERecruitmentss.Models;
using System.Security.Cryptography;
using System.Text;

namespace BERecruitmentss.Data
{
    public class SeedData
    {
        private readonly ApplicationDbContext _context;

        public SeedData(ApplicationDbContext context)
        {
            _context = context;
        }

        public void Initialize()
        {
            // Kiểm tra nếu không có nhân viên nào

            if (!_context.Staff.Any())
            {
                var s1 = new Staff() { EmployeeCode = "V1001", StaffName = "son123", Password = ComputeMD5Hash("123456"), Role = 1, Email = "son.bh.2216@aptechlearning.edu.vn" };
                var s2 = new Staff() { EmployeeCode = "V1002", StaffName = "Jane Smith", Password = ComputeMD5Hash("password456"), Role = 2, Email = "jane@example.com" };
                var s3 = new Staff() { EmployeeCode = "V1003", StaffName = "Alice Johnson", Password = ComputeMD5Hash("password789"), Role = 3, Email = "alice@example.com" };
                var s4 = new Staff() { EmployeeCode = "V1004", StaffName = "Bob Brown", Password = ComputeMD5Hash("passwordabc"), Role = 1, Email = "bob@example.com" };
                var s5 = new Staff() { EmployeeCode = "V1005", StaffName = "Eva Martinez", Password = ComputeMD5Hash("passworddef"), Role = 2, Email = "eva@example.com" };

                _context.Staff.AddRange(s1, s2, s3, s4, s5);
                _context.SaveChanges();
            }

        }

        private string ComputeMD5Hash(string input)
        {
            using (MD5 md5 = MD5.Create())
            {
                byte[] data = md5.ComputeHash(Encoding.UTF8.GetBytes(input));
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < data.Length; i++)
                {
                    sb.Append(data[i].ToString("x2"));
                }
                return sb.ToString();
            }
        }
    }
}
