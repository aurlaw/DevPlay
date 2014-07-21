using System;
using SampleNode.Data;

namespace SampleNode
{
	class MainClass
	{
		public static void Main (string[] args)
		{
			var main = new MainClass ();
			main.Test ();
		}


		public async void Test() {
			var t = new Tester ();
			var result = await t.Perform ('t');

			Console.WriteLine (result);

		}
	}
}
