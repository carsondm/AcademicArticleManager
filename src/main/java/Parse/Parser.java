package Parse;

import org.grobid.core.data.BiblioItem;
import org.grobid.core.engines.Engine;
import org.grobid.core.factory.GrobidFactory;
import org.grobid.core.main.GrobidHomeFinder;
import org.grobid.core.utilities.GrobidProperties;

import java.io.FileInputStream;
import java.util.Arrays;
import java.util.Properties;

public class Parser {

    public static void main(String[] args) {
        Parser parser = new Parser();
        System.out.println(parser.parseFile("C:\\Programming\\IdeaProjects\\GroupProject\\AcademicArticleManager-Fork\\src\\main\\resources\\TestFiles(PDF)\\UCFDatabase\\06740844.pdf"));

        System.exit(0);

    }

    public Parser() {
    }

    public String parseFile(String filepath){
        String pdfPath = filepath;


        try {

            Properties prop = new Properties();
            prop.load(new FileInputStream("grobid-example.properties"));
            String pGrobidHome = prop.getProperty("grobid_example.pGrobidHome");


            // The GrobidHomeFinder can be instantiate without parameters to verify the grobid home in the standard
            // location (classpath, ../grobid-home, ../../grobid-home or in the environment variable GROBID_HOME

            // If the location is customised:
            GrobidHomeFinder grobidHomeFinder = new GrobidHomeFinder(Arrays.asList(pGrobidHome));

            //The GrobidProperties needs to be instantiate using the correct grobidHomeFinder or it will use the default
            //locations
            GrobidProperties.getInstance(grobidHomeFinder);

            System.out.println(">>>>>>>> GROBID_HOME="+ GrobidProperties.get_GROBID_HOME_PATH());

            Engine engine = GrobidFactory.getInstance().getEngine();


            // Biblio object for the result

            BiblioItem resHeader = new BiblioItem();
            String tei = engine.processHeader(pdfPath, true,resHeader);

            return tei;
        }
        catch (Exception e) {
            // If an exception is generated, print a stack trace
            //e.printStackTrace();
        }

        return null;
    }

}
