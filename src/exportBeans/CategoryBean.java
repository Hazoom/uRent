package exportBeans;

import entities.CategoryEntity;

import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: Ran
 * Date: 16/01/15
 * Time: 15:41
 * To change this template use File | Settings | File Templates.
 */
public class CategoryBean {

    private int id;
    private String name;
    private List<CategoryBean> subCategories;

    public CategoryBean(CategoryEntity Category, List<CategoryEntity> SubCategories) {
        this.id = Category.getId();
        this.name = Category.getCategoryname();

        if (SubCategories != null){
            this.subCategories = new ArrayList<CategoryBean>();
            for (CategoryEntity c : SubCategories){
                this.subCategories.add(new CategoryBean(c, null));
            }
        }
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<CategoryBean> getSubCategories() {
        return subCategories;
    }

    public void setSubCategories(List<CategoryBean> subCategories) {
        this.subCategories = subCategories;
    }
}
