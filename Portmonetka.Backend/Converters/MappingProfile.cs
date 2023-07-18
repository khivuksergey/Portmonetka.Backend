using AutoMapper;

namespace Portmonetka.Converters
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<DateTimeOffset, DateTime>().ConvertUsing(d => d.UtcDateTime);
            CreateMap<DateTime, DateTimeOffset>().ConvertUsing(d => new DateTimeOffset(d));
        }
    }
}
