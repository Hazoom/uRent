package application;

import javax.ejb.Stateless;

/**
 * Created with IntelliJ IDEA.
 * User: Ran
 * Date: 29/11/14
 * Time: 20:31
 * To change this template use File | Settings | File Templates.
 */
@Stateless
public class Location {
    private double latitude;
    private double longitude;

    public Location() {
    }

    public Location(double latitude, double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    /**
     *
     * @param location
     * @return
     */
    public double calculateDistance(Location location){
        double DiffLatitude = rad(location.getLatitude() - this.latitude);
        double DiffLongitude = rad(location.getLongitude() - this.longitude);
        double a = Math.sin(DiffLatitude / 2) * Math.sin(DiffLatitude / 2) +
                Math.cos(rad(this.latitude)) * Math.cos(rad(location.latitude)) *
                        Math.sin(DiffLongitude / 2) * Math.sin(DiffLongitude / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return ApplicationConstants.EARTH_MEAN_RADIUS_IN_KM * c;
    }

    /**
     *
     * @param doubleNum
     * @return
     */
    private double rad(double doubleNum){
        return doubleNum * Math.PI / 180;
    }
}
