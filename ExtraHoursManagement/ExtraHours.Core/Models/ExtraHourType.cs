namespace ExtraHours.Core.Models {
    public class ExtraHourType
    {
        public int Id { get; set;}

        public required string Name { get; set;}

        public required decimal RateMultiplier { get; set;}

    }
}