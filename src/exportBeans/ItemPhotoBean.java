package exportBeans;

import entities.ItemPhotoEntity;

/**
 * Created with IntelliJ IDEA.
 * User: Ran
 * Date: 16/01/15
 * Time: 17:49
 * To change this template use File | Settings | File Templates.
 */
public class ItemPhotoBean {

    private int id;
    private String photo;

    public ItemPhotoBean(ItemPhotoEntity itemPhoto) {
        this.id = itemPhoto.getId();
        this.photo = itemPhoto.getPhoto();
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }
}
