import org.junit.Test;

import java.io.File;
import java.io.FileFilter;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.*;

public class ParseTest {
    final File folder = new File("C:\\Users\\gunbo\\Parser\\src\\test\\resources");
    final List<File> fileList = Arrays.asList(folder.listFiles(new FileFilter() {
        public boolean accept(File pathname) {
            return pathname.isFile();
        }
    }));

    Parse parseTest;

    @Test
    public void parse(){
        //System.out.println(parseTest.getArticleAbstract());
        //System.out.println(parseTest.getAuthors());
        //System.out.println(parseTest.getDateOfPublication());
        //System.out.println(parseTest.getPublisher());
        //System.out.println(parseTest.getTags());
        for(int i = 0; i < fileList.size(); i++){
            parseTest = new Parse(fileList.get(i).toString());
            System.out.println(parseTest.getTitle().toString());
            assertFalse(parseTest.getTitle() == null || parseTest.getArticleAbstract() == null);
        }

        assert true;

    }

}