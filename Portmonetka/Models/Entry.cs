using System.ComponentModel.DataAnnotations;

namespace Portmonetka.Models
{
    public class Entry
    {
        [Key]
        public int Id { get; set; }
        public string Data { get; set; }
    }
}
