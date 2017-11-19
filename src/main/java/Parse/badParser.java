package Parse;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

import org.apache.pdfbox.cos.COSDocument;
import org.apache.pdfbox.io.RandomAccessFile;
import org.apache.pdfbox.pdfparser.PDFParser;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentInformation;
import org.apache.pdfbox.text.PDFTextStripper;




public class badParser {
   static String path1 = "C:\\Programming\\IdeaProjects\\GroupProject\\AcademicArticleManager-Fork\\src\\main\\resources\\TestFiles(PDF)\\Ahmed_An_Improved_Deep_2015_CVPR_paper.pdf";
   static String path2 = "C:\\Programming\\IdeaProjects\\GroupProject\\AcademicArticleManager-Fork\\src\\main\\resources\\TestFiles(PDF)\\Huang_SALICON_Reducing_the_ICCV_2015_paper.pdf";
   static String path3 = "C:\\Programming\\IdeaProjects\\GroupProject\\AcademicArticleManager-Fork\\src\\main\\resources\\TestFiles(PDF)\\Jayaraman_Learning_Image_Representations_ICCV_2015_paper.pdf";
   static String path4 = "C:\\Programming\\IdeaProjects\\GroupProject\\AcademicArticleManager-Fork\\src\\main\\resources\\TestFiles(PDF)\\about_metadata.pdf";
   static String path5 = "C:\\Programming\\IdeaProjects\\GroupProject\\AcademicArticleManager-Fork\\src\\main\\resources\\TestFiles(PDF)\\UCFDatabase\\06740844.pdf";
   static String path6 = "C:\\Programming\\IdeaProjects\\GroupProject\\AcademicArticleManager-Fork\\src\\main\\resources\\TestFiles(PDF)\\UCFDatabase\\06740844.pdf";
    public static void main(String[] args) {

        //System.out.println(parse.getPDFText(path6));



    }

    private PDFParser parser;
    private PDFTextStripper pdfStripper;
    private PDDocument pdDoc ;
    private COSDocument cosDoc ;

    private String Text ;
    private String filePath;
    private File file;

    private String PDFText;

    private int pageCount;
    private String title;
    private ArrayList<String> authors;
    private String subject;
    private String keywords;
    private String creationDate;

    public badParser(String filePath) {
        this.filePath = filePath;
        try {
            PDFText = ToText();
        } catch (IOException e) {
            e.printStackTrace();
            PDFText = null;
        }

        try {
            extractMetaData();
        } catch (IOException e) {
            e.printStackTrace();
        }


    }

    public badParser() {
    }

    /*https://radixcode.com/pdfbox-example-code-how-to-extract-text-from-pdf-file-with-java*/
    public String ToText() throws IOException
    {
        this.pdfStripper = null;
        this.pdDoc = null;
        this.cosDoc = null;

        file = new File(filePath);
        parser = new PDFParser(new RandomAccessFile(file,"r")); // update for PDFBox V 2.0

        parser.parse();
        cosDoc = parser.getDocument();
        pdfStripper = new PDFTextStripper();
        pdDoc = new PDDocument(cosDoc);
        pdDoc.getNumberOfPages();
        pdfStripper.setStartPage(1);
        pdfStripper.setEndPage(2);

        // reading text from page 1 to 10
        // if you want to get text from full pdf file use this code
        // pdfStripper.setEndPage(pdDoc.getNumberOfPages());

        Text = pdfStripper.getText(pdDoc);
        return Text;
    }

    /*
    * https://pdfbox.apache.org/1.8/cookbook/workingwithmetadata.html
    * Useless majority of tested pdf are not using metadata or incorrect information
    * */
    private void extractMetaData()throws IOException{
        PDDocumentInformation information = pdDoc.getDocumentInformation();
        pageCount = pdDoc.getNumberOfPages();
        title = information.getTitle();
        //System.out.println(information.getAuthor());
        subject = information.getSubject();
        //System.out.println(information.getProducer());
        keywords = information.getKeywords();
        try{
            creationDate = information.getCreationDate().toString();
        }catch (NullPointerException e){
            creationDate = null;
        }

        //System.out.println("Page count: " + pageCount + "\ntitle: " + title + "\nsubject: " + subject + "\nkeywords: " + keywords + "\ncreationdate: " + creationDate);
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getPDFText() {
        return PDFText;
    }

    public int getPageCount() {
        return pageCount;
    }

    public String getTitle() {
        return title;
    }

    public ArrayList<String> getAuthors() {
        return authors;
    }

    public String getSubject() {
        return subject;
    }

    public String getKeywords() {
        return keywords;
    }

    public String getCreationDate() {
        return creationDate;
    }
}
