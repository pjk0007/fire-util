import Tiptap from '@/components/Tiptap/Tiptap';
import { storage } from '@/lib/firebase';
import { formatSizeString } from '@/lib/FireUtil/sizeformat';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const testContent = ` 
<file-node src="https://placehold.co/600x400/0000FF/FFFFFF" fileSize="100 KB" fileName="placeholder.png" alt="Placeholder Image" >
<p>test</p>
</file-node>

<blockquote>
        Nothing is impossible, the word itself says “I’m possible!”
      </blockquote>
  <p>Look at these details</p>
      <details>
        <summary>This is a summary</summary>
        <p>Surprise!</p>
      </details>
      <p>Nested details are also supported</p>
      <details open>
        <summary>This is another summary</summary>
        <p>And there is even more.</p>
        <details>
          <summary>We need to go deeper</summary>
          <p>Booya!</p>
        </details>
      </details>
      <p>Audrey Hepburn</p>
    <aside>  <p><strong>This is bold.</strong></p>
        <p><b>And this.</b></p>
        <p style="font-weight: bold">This as well.</p>
          <p>This isn’t code.</p>
        <p><code>This is code.</code></p>
         <p>This isn’t highlighted.</s></p></aside>
        <p><mark>But that one is.</mark></p>
        <p><mark style="background-color: red;">And this is highlighted too, but in a different color.</mark></p>
        <p><mark data-color="#ffa8a8">And this one has a data attribute.</mark></p>
         <p>This isn’t italic.</p>
        <p><em>This is italic.</em></p>
        <p><i>And this.</i></p>
        <p style="font-style: italic">This as well.</p>
         <p>
          Wow, this editor has support for links to the whole <a href="https://en.wikipedia.org/wiki/World_Wide_Web">world wide web</a>. We tested a lot of URLs and I think you can add *every URL* you want. Isn’t that cool? Let’s try <a href="https://statamic.com/">another one!</a> Yep, seems to work.
        </p>
        <p>
          By default every link will get a <code>rel="noopener noreferrer nofollow"</code> attribute. It’s configurable though.
        </p>
         <p>This isn’t striked through.</s></p>
          <p><s>But that’s striked through.</s></p>
          <p><del>And this.</del></p>
          <p><strike>This too.</strike></p>
          <p style="text-decoration: line-through">This as well.</p>
              <p>This is regular text.</p>
        <p><sub>This is subscript.</sub></p>
        <p><span style="vertical-align: sub">And this.</span></p>
          <p>This is regular text.</p>
        <p><sup>This is superscript.</sup></p>
        <p><span style="vertical-align: super">And this.</span></p>
         <p><span>This has a &lt;span&gt; tag without a style attribute, so it’s thrown away.</span></p>
        <p><span style="">But this one is wrapped in a &lt;span&gt; tag with an inline style attribute, so it’s kept - even if it’s empty for now.</span></p>


        <p>--- merge nested span styles option enabled ---</p>

        <p>
          <span style="color: #FF0000;">
            <span style="font-family: serif;">
              red serif
            </span>
          </span>
        </p>

        <p>
          <span style="color: #FF0000;">
            <span style="font-family: serif;">
              <span style="color: #0000FF;">
                blue serif
              </span>
            </span>
          </span>
        </p>

        <p>
          <span style="color: #00FF00;">
            <span style="font-family: serif;">green serif </span>
            <span style="font-family: serif;color: #FF0000;">red serif</span>
          </span>
        </p>

        <p>
          <span>
            plain
            <span style="color: #0000FF;">blue</span>
            plain
            <span style="color: #00FF00;">
              green
              <span style="font-family: serif;">green serif</span>
            </span>
            plain
          </span>
        </p>

        <p>
            <span style="color: #0000FF;">
              blue
              <span style="color: #00FF00;">
                green
                <span style="font-family: serif;">
                  green serif
                  <span style="color: #0000FF;">blue serif</span>
                </span>
              </span>
            </span>
        </p>

        <p>
          <strong>
            strong
            <span style="color: #0000FF;">
              <strong>
                strong blue
                <span style="font-size: 24px;font-family: serif;">strong blue serif </span>
                <span style="color: #00FF00;">
                  strong green
                  <span style="font-family: serif;">strong green serif</span>
                </span>
              </strong>
            </span>
          </strong>
        </p>
          <p>There is no underline here.</p>
        <p><u>This is underlined though.</u></p>
        <p style="text-decoration: underline">And this as well.</p>
        <ul>
          <li>A list item</li>
          <li>And another one</li>
        </ul>
        <ol>
          <li>A list item</li>
          <li>And another one</li>
        </ol>
         <ul data-type="taskList">
          <li data-type="taskItem" data-checked="true">A list item</li>
          <li data-type="taskItem" data-checked="false">And another one</li>
        </ul>
        <div data-youtube-video>
        <iframe src="https://www.youtube.com/watch?v=3lTUAWOgoHs"></iframe>
      </div>
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th colspan="3">Description</th>
            </tr>
            <tr>
              <td>Cyndi Lauper</td>
              <td>Singer</td>
              <td>Songwriter</td>
              <td>Actress</td>
            </tr>
          </tbody>
        </table>
         <pre><code class="language-javascript">/*asdfasdf*/
         for (var i=1; i <= 20; i++)
{
  if (i % 15 == 0)
    console.log("FizzBuzz");
  else if (i % 3 == 0)
    console.log("Fizz");
  else if (i % 5 == 0)
    console.log("Buzz");
  else
    console.log(i);
}</code></pre>
<span data-type="emoji" data-name="smiley"></span>
        <h1>This is a 1st level heading</h1>
        <h2>This is a 2nd level heading</h2>
        <h3>This is a 3rd level heading</h3>
        <h4>This 4th level heading will be converted to a paragraph, because levels are configured to be only 1, 2 or 3.</h4>
        <img src="https://placehold.co/800x400/6A00F5/white" />
      `;

export default function Editor() {
    return (
        <div className="w-[100dvw] h-[100dvh]">
            <Tiptap
                id="test"
                editable={true}
                defaultContent={testContent}
                mentionItems={[
                    'Lea Thompson',
                    'Cyndi Lauper',
                    'Tom Cruise',
                    'Madonna',
                    'Jerry Hall',
                    'Joan Collins',
                    'Winona Ryder',
                    'Christina Applegate',
                ]}
                uploadFile={async (file, onProgress) => {
                    const storageRef = ref(storage, `test/test/${file.name}`);
                    const uploadTask = uploadBytesResumable(storageRef, file);

                    return new Promise((resolve, reject) => {
                        uploadTask.on(
                            'state_changed',
                            (snapshot) => {
                                const progress = Math.round(
                                    (snapshot.bytesTransferred /
                                        snapshot.totalBytes) *
                                        100
                                );
                                if (onProgress) {
                                    onProgress({
                                        progress: progress,
                                    });
                                }
                            },
                            (error) => {
                                reject(error);
                            },
                            async () => {
                                const downloadURL = await getDownloadURL(
                                    storageRef
                                );
                                resolve({
                                    fileName: file.name,
                                    fileSize: formatSizeString(file.size),
                                    src: downloadURL,
                                });
                            }
                        );
                    });
                }}
            />
        </div>
    );
}
