There are papers that describe how labeling and data annotation is done such as the [mscoco paper](https://arxiv.org/abs/1405.0312) and the [youtube8m paper](https://research.google.com/youtube8m/youtube8m-paper.pdf), those are likely worth reading. There are also a number of code projects to help you set up mechanical turk for your labeling problem, I suggest searching via google and github.

Here are some steps I recall from my reading which help address label consistency:

 - Often they start with a test to make sure the users on turk have an understanding of what they are supposed to do.
 - Run the same data twice to make sure users agree, with some metric of the difference if it is not a per image label (for example mscoco’s segmentation).
 - Have users evaluate each other’s work.
 - Periodically introduce examples you have labeled yourself to make sure the users label data in the same way that you would label data.
Remove users and that aren’t good enough according to your evaluation in 1-5

I suggest saving your annotations in a format that is widely used and for which readers/writers already exist, such as the mscoco annotation format, or youtube 8m https://research.google.com/youtube8m/.

Here are some example annotators:

 - https://github.com/nightrome/cocostuff#annotation-tool
 - https://github.com/CSAILVision/LabelMeAnnotationTool