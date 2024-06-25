using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BERecruitmentss.Models;

namespace BERecruitmentss.Common.BillDTO
{
    public class RequestBillFullDetail : Base
    {
        public string? Code { get; set; }
        public DateTime? Date { get; set; }
        public string? PhoneNumber { get; set; }

        public List<BillDetailDTO> BillDetails {get; set;}
    }

    public class BillDetailDTO : Base {
        public int? BillId { get; set; }
        public int? ProductId { get; set; }
        public decimal? Price { get; set;}
        public int? Quantity { get; set; }
    }
}