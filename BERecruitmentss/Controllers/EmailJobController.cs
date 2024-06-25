using BERecruitmentss.Repository;
using BERecruitmentss.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace BERecruitmentss.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailJobController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly IEmailRepository _emailRepository;

        public EmailJobController(IEmailRepository emailRepository, IEmailService emailService)
        {
            _emailRepository = emailRepository;
            _emailService = emailService;
        }

        [HttpPost("applyjob")]
        public async Task<IActionResult> ApplyJob([FromBody] JobApplicationModel model)
        {
            if (model == null || string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.ApplicantName))
            {
                return BadRequest(new { message = "Dữ liệu mô hình không hợp lệ" });
            }
            string email = model.Email;
            DateTime? InterviewStartDate = !string.IsNullOrEmpty(model.InterviewStartDate) && model.InterviewStartDate != "null" ? DateTime.Parse(model.InterviewStartDate) : (DateTime?)null; 
            DateTime? InterviewEndDate = !string.IsNullOrEmpty(model.InterviewEndDate) && model.InterviewEndDate != "null" ? DateTime.Parse(model.InterviewEndDate) : (DateTime?)null;  // Assuming the interview date is passed in the model
            string applicantName = model.ApplicantName; // Assuming the applicant's name is also passed in the model

            // Kiểm tra xem email có tồn tại trong cơ sở dữ liệu không
            var user = await _emailRepository.GetUserByEmailAsync(email);

            if (user == null)
            {
                // Log lỗi ở đây
                Console.WriteLine($"Không thể tìm thấy người dùng với email: {email}");
                return BadRequest(new { message = "Email không tồn tại." });
            }

            // Tạo nội dung email
            string interviewStartDateStr = InterviewStartDate.HasValue ? InterviewStartDate.Value.ToString("dd/MM/yyyy HH:mm") : "N/A";
            string interviewEndDateStr = InterviewEndDate.HasValue ? InterviewEndDate.Value.ToString("dd/MM/yyyy HH:mm") : "N/A";
            string emailContent = $@"
                Kính gửi {applicantName},

                Cảm ơn bạn đã ứng tuyển vào vị trí công việc tại công ty chúng tôi.

                Chúng tôi xin thông báo rằng đơn ứng tuyển của bạn đã được chấp nhận. 
                Chúng tôi mời bạn đến tham dự buổi phỏng vấn trong khoảng thời gian {interviewStartDateStr} - {interviewEndDateStr}.

                Trân trọng,
                Đội ngũ tuyển dụng
            ";

            // Địa chỉ email gốc để gửi email
            string fromEmail = "your_email@gmail.com"; // Thay đổi email của bạn tại đây
            string emailSubject = "Xác nhận ứng tuyển thành công và hẹn phỏng vấn";

            // Gửi email
            await _emailService.SendEmailAsync(fromEmail, model.Email, emailSubject, emailContent);

            return Ok(new { message = "Email xác nhận ứng tuyển và hẹn phỏng vấn đã được gửi." });
        }
    }

    public class JobApplicationModel
    {
        public string Email { get; set; }
        public string InterviewStartDate { get; set; }
        public string InterviewEndDate { get; set; }
        public string ApplicantName { get; set; }
    }
}
