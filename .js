import org.json.*;
import java.net.URIBuilder;
import java.time.ZonedDateTime;
import java.time.ZoneId;

public class WeatherApp {
    private static final String apiEndPoint = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
    private static final String location = "London,UK";
    private static final String unitGroup = "metric";
    private static final String apiKey = "04006f0875c58d889925a0b2b2c05737";

    public static void main(String[] args) throws Exception {
        // Build the URL
        URIBuilder builder = new URIBuilder(apiEndPoint + location);
        builder.setParameter("unitGroup", unitGroup)
                .setParameter("key", apiKey);

        // Send the request
        JSONObject timelineResponse = new JSONObject(HttpClientUtil.sendGetRequest(builder));

        // Extract the timezone and resolved address
        ZoneId zoneId = ZoneId.of(timelineResponse.getString("timezone"));
        System.out.printf("Weather data for: %s%n", timelineResponse.getString("resolvedAddress"));

        // Print the weather data
        System.out.printf("Date\tMaxTemp\tMinTemp\tPrecip\tSource%n");
        JSONArray values = timelineResponse.getJSONArray("days");
        for (int i = 0; i < values.length(); i++) {
            JSONObject dayValue = values.getJSONObject(i);
            ZonedDateTime datetime = ZonedDateTime.ofInstant(Instant.ofEpochSecond(dayValue.getLong("datetimeEpoch")), zoneId);
            double maxtemp = dayValue.getDouble("tempmax");
            double mintemp = dayValue.getDouble("tempmin");
            double pop = dayValue.getDouble("precip");
            String source = dayValue.getString("source");
            System.out.printf("%s\t%.1f\t%.1f\t%.1f\t%s%n", datetime.format(DateTimeFormatter.ISO_LOCAL_DATE), maxtemp, mintemp, pop, source);
        }
    }
}
