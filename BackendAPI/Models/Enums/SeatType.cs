using System.Runtime.Serialization;

namespace BackendAPI.Models.Enums
{
    public enum SeatType
    {
        [EnumMember(Value = "Regular")]
        Regular,
        [EnumMember(Value = "VIP")]
        VIP,
        [EnumMember(Value = "FirstClass")]
        FirstClass
    }
}