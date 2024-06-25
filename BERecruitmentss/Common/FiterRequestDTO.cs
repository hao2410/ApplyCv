namespace BERecruitmentss.Common
{
    public class FiterRequestDTO
    {
        public List<FilterParams> filterParams { get; set; } = null;
        public string sortCol { get; set; } = "Id";
        public bool sortAsc { get; set; } = true;
        public int index { get; set; } = 1;
        public int size { get; set; } = 3;
    }

    public class FilterParams
    {
        public string colName { get; set; }
        public string _operator { get; set; }
        public string value { get; set; }
    }
}
